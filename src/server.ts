import express, { Request, Response, NextFunction } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// ----------------- CONFIG -----------------
const PORT = 5000;
const JWT_SECRET = 'your_jwt_secret_key';
const MONGO_URI = 'mongodb+srv://avditor:mongopassword@cluster0.dqm62uq.mongodb.net/?appName=Cluster0';
const DB_NAME = 'crm_system';

// ----------------- DATABASE CONNECTION -----------------
let db: any;
MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection failed:', err));

// ----------------- TYPES -----------------
interface JwtPayload {
  email: string;
}

// ----------------- AUTH MIDDLEWARE -----------------
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch {
    res.status(400).json({ message: 'Invalid token' });
  }
}

// ----------------- ROUTES -----------------

// ✅ Employee Registration
app.post('/api/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const existing = await db.collection('employees').findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    await db.collection('employees').insertOne({ name, email, password: hashed });

    res.json({ message: 'Employee registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering employee', error: err });
  }
});

// ✅ Employee Login
app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const employee = await db.collection('employees').findOne({ email });
    if (!employee) return res.status(400).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, employee.password);
    if (!valid) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// ✅ Public Enquiry Form (No Auth)
app.post('/api/enquiry', async (req: Request, res: Response) => {
  try {
    const { name, email, courseInterest } = req.body;
    if (!name || !email || !courseInterest) return res.status(400).json({ message: 'All fields required' });

    await db.collection('enquiries').insertOne({
      name,
      email,
      courseInterest,
      claimedBy: null,
      createdAt: new Date(),
    });

    res.json({ message: 'Enquiry submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting enquiry', error: err });
  }
});

// ✅ Fetch Unclaimed Leads (Public Enquiries)
app.get('/api/enquiries/public', authMiddleware, async (req: Request, res: Response) => {
  try {
    const enquiries = await db.collection('enquiries').find({ claimedBy: null }).sort({ createdAt: -1 }).toArray();

    res.json({ enquiries });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching public enquiries', error: err });
  }
});

// ✅ Claim Lead
app.post('/api/enquiries/claim/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userEmail = (req as any).user.email;

    const enquiry = await db.collection('enquiries').findOne({ _id: new ObjectId(id) });
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    if (enquiry.claimedBy) return res.status(400).json({ message: 'Enquiry already claimed' });

    await db.collection('enquiries').updateOne({ _id: new ObjectId(id) }, { $set: { claimedBy: userEmail } });

    res.json({ message: 'Enquiry claimed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error claiming enquiry', error: err });
  }
});

// ✅ Fetch Leads Claimed by Logged-in User
app.get('/api/enquiries/my', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userEmail = (req as any).user.email;
    const enquiries = await db.collection('enquiries').find({ claimedBy: userEmail }).sort({ createdAt: -1 }).toArray();

    res.json({ enquiries });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching claimed enquiries', error: err });
  }
});

// ----------------- DEFAULT -----------------
app.get('/', (_, res) => {
  res.send('CRM REST API is running ✅');
});
