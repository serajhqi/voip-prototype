import { WebSocket } from 'ws';
import { Customer, Staff, CallRecord, AdminRubric, AdminTagRule, FollowUpTask } from './types.js';
import { initialCustomers, initialStaff, initialCalls, initialRubrics, initialTagRules, initialFollowUpTasks, simulationPresets } from './mockData.js';

export interface ActiveCallState {
  callId: string;
  presetId: string;
  status: 'ringing' | 'in_progress' | 'ended' | 'analyzing' | 'completed';
  startTime: number;
  durationSec: number;
  staff: Staff;
  customer: Customer;
  isNewCustomer: boolean;
  currentDiarizedIndex: number;
  activeTurns: any[];
}

export class MemoryStore {
  customers: Customer[] = [...initialCustomers];
  staff: Staff[] = [...initialStaff];
  calls: CallRecord[] = [...initialCalls];
  rubrics: AdminRubric[] = [...initialRubrics];
  tagRules: AdminTagRule[] = [...initialTagRules];
  tasks: FollowUpTask[] = [...initialFollowUpTasks];
  
  activeCall: ActiveCallState | null = null;
  activeCallTimer: NodeJS.Timeout | null = null;
  
  wsClients: Set<WebSocket> = new Set();

  registerClient(ws: WebSocket) {
    this.wsClients.add(ws);
    // Send initial snapshot
    ws.send(JSON.stringify({
      type: 'INIT_SYNC',
      payload: {
        activeCall: this.activeCall,
        tasks: this.tasks,
        staff: this.staff,
        customers: this.customers,
        calls: this.calls,
        rubrics: this.rubrics,
        tagRules: this.tagRules
      }
    }));
  }

  unregisterClient(ws: WebSocket) {
    this.wsClients.delete(ws);
  }

  broadcast(message: { type: string; payload: any }) {
    const data = JSON.stringify(message);
    for (const client of this.wsClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  }

  triggerCallSimulation(presetId: string) {
    const preset = simulationPresets.find(p => p.id === presetId) || simulationPresets[0];
    
    // Stop any existing call timer
    if (this.activeCallTimer) {
      clearInterval(this.activeCallTimer);
      this.activeCallTimer = null;
    }

    const callId = `call-sim-${Date.now()}`;
    const isNew = !this.customers.some(c => c.id === preset.customer.id || c.phone === preset.customer.phone);

    // Update staff status
    const assignedStaff = this.staff.find(s => s.id === preset.staff.id) || this.staff[0];
    assignedStaff.status = 'on_call';

    this.activeCall = {
      callId,
      presetId: preset.id,
      status: 'ringing',
      startTime: Date.now(),
      durationSec: 0,
      staff: assignedStaff,
      customer: preset.customer,
      isNewCustomer: isNew,
      currentDiarizedIndex: 0,
      activeTurns: []
    };

    this.broadcast({
      type: 'CALL_RINGING',
      payload: {
        activeCall: this.activeCall,
        screenPop: {
          customer: preset.customer,
          isNewCustomer: isNew,
          recentCalls: this.calls.filter(c => c.customerId === preset.customer.id),
          openTasks: this.tasks.filter(t => t.customerId === preset.customer.id && t.status !== 'Completed')
        }
      }
    });

    return this.activeCall;
  }

  answerCall() {
    if (!this.activeCall || this.activeCall.status !== 'ringing') return null;

    this.activeCall.status = 'in_progress';
    this.activeCall.startTime = Date.now();
    const preset = simulationPresets.find(p => p.id === this.activeCall?.presetId) || simulationPresets[0];

    this.broadcast({
      type: 'CALL_ANSWERED',
      payload: { activeCall: this.activeCall }
    });

    // Stream diarized dialogue every 3 seconds to simulate conversation
    let turnIndex = 0;
    this.activeCallTimer = setInterval(() => {
      if (!this.activeCall || this.activeCall.status !== 'in_progress') {
        if (this.activeCallTimer) clearInterval(this.activeCallTimer);
        return;
      }

      this.activeCall.durationSec = Math.floor((Date.now() - this.activeCall.startTime) / 1000);

      if (turnIndex < preset.diarizedTurns.length) {
        const nextTurn = preset.diarizedTurns[turnIndex];
        this.activeCall.activeTurns.push(nextTurn);
        this.activeCall.currentDiarizedIndex = turnIndex;

        this.broadcast({
          type: 'SPEECHMATICS_TURN_STREAM',
          payload: {
            turn: nextTurn,
            durationSec: this.activeCall.durationSec,
            activeTurns: this.activeCall.activeTurns
          }
        });
        turnIndex++;
      } else {
        // Auto-end call after dialogue completes
        this.endCall();
      }
    }, 3200);

    return this.activeCall;
  }

  endCall() {
    if (!this.activeCall) return null;
    if (this.activeCallTimer) {
      clearInterval(this.activeCallTimer);
      this.activeCallTimer = null;
    }

    const preset = simulationPresets.find(p => p.id === this.activeCall?.presetId) || simulationPresets[0];
    this.activeCall.status = 'analyzing';

    this.broadcast({
      type: 'CALL_ENDED',
      payload: {
        activeCall: this.activeCall,
        message: 'Audio captured. Dispatching Speechmatics Diarization & LLM Evaluation jobs...'
      }
    });

    // Simulate speechmatics + LLM analysis completion after 2.5s
    setTimeout(() => {
      if (!this.activeCall) return;

      const finishedCallId = this.activeCall.callId;
      const customer = this.activeCall.customer;
      const isNew = this.activeCall.isNewCustomer;

      // 1. If customer was new, register in customer directory
      if (isNew && !this.customers.some(c => c.id === customer.id)) {
        this.customers.unshift(customer);
      } else {
        // Update customer last call date and willingness
        const existing = this.customers.find(c => c.id === customer.id);
        if (existing) {
          existing.lastCallDate = new Date().toISOString();
          existing.totalCalls += 1;
          existing.purchaseWillingness = preset.analysis?.customerPurchaseWillingness ?? existing.purchaseWillingness;
          if (preset.analysis?.extractedTags.customerTags) {
            existing.tags = Array.from(new Set([...existing.tags, ...preset.analysis.extractedTags.customerTags]));
          }
        }
      }

      // 2. Create follow up task
      const newTask: FollowUpTask = {
        ...preset.task,
        id: `task-${Date.now()}`,
        callId: finishedCallId,
        customerId: customer.id,
        createdAt: new Date().toISOString()
      };
      this.tasks.unshift(newTask);

      // 3. Save call record
      const newCallRecord: CallRecord = {
        id: finishedCallId,
        direction: 'inbound',
        startTime: new Date(this.activeCall.startTime).toISOString(),
        endTime: new Date().toISOString(),
        durationSec: Math.max(this.activeCall.durationSec, 45),
        staffId: this.activeCall.staff.id,
        customerId: customer.id,
        customerPhone: customer.phone,
        customerName: customer.name,
        status: 'completed',
        diarizedTurns: preset.diarizedTurns,
        analysis: preset.analysis,
        tasksCreated: [newTask]
      };
      this.calls.unshift(newCallRecord);

      // 4. Reset staff status
      const staffMember = this.staff.find(s => s.id === this.activeCall?.staff.id);
      if (staffMember) {
        staffMember.status = 'available';
        staffMember.totalCallsHandled += 1;
      }

      this.activeCall.status = 'completed';

      this.broadcast({
        type: 'ANALYSIS_COMPLETED',
        payload: {
          callRecord: newCallRecord,
          newTask,
          customer,
          isNewCustomer: isNew
        }
      });

      this.activeCall = null;
    }, 2400);

    return this.activeCall;
  }

  // Task status update
  updateTaskStatus(taskId: string, status: FollowUpTask['status']) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      this.broadcast({ type: 'TASK_UPDATED', payload: task });
    }
    return task;
  }

  // Task creation
  addTask(taskData: Partial<FollowUpTask> & { title: string; assignedStaffId: string }) {
    const newTask: FollowUpTask = {
      id: taskData.id || `task-${Date.now()}`,
      callId: taskData.callId || '',
      customerId: taskData.customerId || '',
      customerName: taskData.customerName || (this.customers.find(c => c.id === taskData.customerId)?.name || 'مشتری بدون نام'),
      assignedStaffId: taskData.assignedStaffId,
      staffName: taskData.staffName || (this.staff.find(s => s.id === taskData.assignedStaffId)?.name || 'کارشناس'),
      title: taskData.title,
      description: taskData.description || '',
      dueTime: taskData.dueTime || new Date(Date.now() + 86400000).toISOString(),
      deadline: taskData.deadline || 'فردا ساعت ۱۰:۰۰',
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Pending',
      createdAt: taskData.createdAt || new Date().toISOString()
    };
    this.tasks.unshift(newTask);
    this.broadcast({ type: 'TASK_CREATED', payload: newTask });
    return newTask;
  }

  // Rubrics update
  updateRubric(id: string, updates: Partial<AdminRubric>) {
    const rubric = this.rubrics.find(r => r.id === id);
    if (rubric) {
      Object.assign(rubric, updates);
      this.broadcast({ type: 'RUBRIC_UPDATED', payload: rubric });
    }
    return rubric;
  }

  addRubric(rubric: Omit<AdminRubric, 'id'>) {
    const newRubric: AdminRubric = {
      ...rubric,
      id: `rub-${Date.now()}`
    };
    this.rubrics.push(newRubric);
    this.broadcast({ type: 'RUBRIC_CREATED', payload: newRubric });
    return newRubric;
  }

  // Customer creation
  addCustomer(customerData: Partial<Customer> & { name: string; phone: string }) {
    const newCustomer: Customer = {
      id: customerData.id || `cust-${Date.now()}`,
      phone: customerData.phone,
      name: customerData.name,
      company: customerData.company || '',
      email: customerData.email || '',
      needs: customerData.needs || [],
      purchaseWillingness: typeof customerData.purchaseWillingness === 'number' ? customerData.purchaseWillingness : 50,
      effortTier: customerData.effortTier || 'T2',
      tags: customerData.tags || ['ثبت-دستی'],
      totalCalls: customerData.totalCalls || 0,
      lastCallDate: customerData.lastCallDate || new Date().toISOString(),
      notes: customerData.notes || ''
    };
    this.customers.unshift(newCustomer);
    this.broadcast({ type: 'CUSTOMER_CREATED', payload: newCustomer });
    return newCustomer;
  }
}

export const store = new MemoryStore();
