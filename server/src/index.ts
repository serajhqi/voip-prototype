import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { store } from './store.js';
import { simulationPresets } from './mockData.js';

const app = express();
const port = process.env.PORT || 3080;

app.use(cors());
app.use(express.json());

// Create HTTP and WebSocket server
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  store.registerClient(ws);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      if (message.type === 'TRIGGER_CALL') {
        store.triggerCallSimulation(message.presetId);
      } else if (message.type === 'ANSWER_CALL') {
        store.answerCall();
      } else if (message.type === 'END_CALL') {
        store.endCall();
      }
    } catch (e) {
      console.error('WS message error:', e);
    }
  });

  ws.on('close', () => {
    store.unregisterClient(ws);
  });
});

// REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/overview', (req, res) => {
  res.json({
    activeCall: store.activeCall,
    totalCalls: store.calls.length,
    totalCustomers: store.customers.length,
    totalStaff: store.staff.length,
    pendingTasks: store.tasks.filter(t => t.status === 'Pending').length,
    simulationPresets: simulationPresets.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      customerName: p.customer.name,
      company: p.customer.company
    }))
  });
});

app.get('/api/calls', (req, res) => {
  res.json(store.calls);
});

app.get('/api/calls/:id', (req, res) => {
  const call = store.calls.find(c => c.id === req.params.id);
  if (!call) {
    return res.status(404).json({ error: 'Call not found' });
  }
  res.json(call);
});

app.get('/api/customers', (req, res) => {
  res.json(store.customers);
});

app.post('/api/customers', (req, res) => {
  const { name, phone, company, email, needs, purchaseWillingness, effortTier, tags, notes } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }
  const newCustomer = store.addCustomer({
    name,
    phone,
    company,
    email,
    needs: Array.isArray(needs) ? needs : (needs ? [needs] : []),
    purchaseWillingness: Number(purchaseWillingness) || 50,
    effortTier: effortTier || 'T2',
    tags: Array.isArray(tags) ? tags : (tags ? [tags] : ['مشتری-جدید']),
    notes: notes || ''
  });
  res.status(201).json(newCustomer);
});

app.get('/api/customers/:id', (req, res) => {
  const customer = store.customers.find(c => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  const customerCalls = store.calls.filter(c => c.customerId === customer.id);
  const customerTasks = store.tasks.filter(t => t.customerId === customer.id);
  res.json({ customer, calls: customerCalls, tasks: customerTasks });
});

app.get('/api/staff', (req, res) => {
  res.json(store.staff);
});

app.get('/api/tasks', (req, res) => {
  res.json(store.tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title, description, assignedStaffId, customerId, dueTime, deadline, priority } = req.body;
  if (!title || !assignedStaffId) {
    return res.status(400).json({ error: 'Title and assignedStaffId are required' });
  }
  const newTask = store.addTask({
    title,
    description,
    assignedStaffId,
    customerId,
    dueTime,
    deadline,
    priority
  });
  res.status(201).json(newTask);
});

app.patch('/api/tasks/:id', (req, res) => {
  const { status } = req.body;
  const updated = store.updateTaskStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(updated);
});

app.get('/api/rubrics', (req, res) => {
  res.json({ rubrics: store.rubrics, tagRules: store.tagRules });
});

app.post('/api/rubrics', (req, res) => {
  const created = store.addRubric(req.body);
  res.status(201).json(created);
});

app.patch('/api/rubrics/:id', (req, res) => {
  const updated = store.updateRubric(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Rubric not found' });
  }
  res.json(updated);
});

// Simulation Control Endpoints
app.post('/api/simulation/call', (req, res) => {
  const { presetId } = req.body;
  const call = store.triggerCallSimulation(presetId);
  res.json({ success: true, activeCall: call });
});

app.post('/api/simulation/answer', (req, res) => {
  const call = store.answerCall();
  res.json({ success: true, activeCall: call });
});

app.post('/api/simulation/end', (req, res) => {
  const call = store.endCall();
  res.json({ success: true, activeCall: call });
});

server.listen(port, () => {
  console.log(`VoIP Prototype Server listening on http://localhost:${port}`);
});
