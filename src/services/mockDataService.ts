import { v4 as uuidv4 } from 'uuid';

// Types
export interface Student {
    id: string;
    name: string;
    gpa: number;
    budget: number;
    career_goals: string[];
    target_country: string;
    avatar_url?: string;
    loan_amount?: number;
}

export interface ChatMessage {
    id: string;
    student_id: string;
    role: 'user' | 'assistant';
    content: string;
    image_url?: string;
    created_at: string;
}

export interface Appointment {
    id: string;
    student_id: string;
    counselor_id?: string;
    status: 'Pending' | 'Validated' | 'Completed';
    date: string;
    created_at: string;
}

export interface MarketData {
    country: string;
    field_of_study: string;
    avg_salary: number;
    visa_success_rate: number;
    demand_trend: 'High' | 'Medium' | 'Low';
    top_skills: { subject: string; A: number; fullMark: number }[]; // For Radar Chart
    financial_forecast: { year: string; debt: number; earnings: number }[]; // For Area Chart
}

// Mock Data
const mockStudents: Student[] = [
    { id: '1', name: 'John Doe', gpa: 3.8, budget: 50000, loan_amount: 40000, career_goals: ['Software Engineer', 'AI Researcher'], target_country: 'USA', avatar_url: '/placeholder-user.jpg' },
    { id: '2', name: 'Jane Smith', gpa: 3.5, budget: 40000, loan_amount: 20000, career_goals: ['Data Scientist'], target_country: 'Germany' },
    { id: '3', name: 'Alice Johnson', gpa: 3.9, budget: 60000, loan_amount: 0, career_goals: ['Product Manager'], target_country: 'UK' },
];

const mockMarketData: MarketData[] = [
    {
        country: 'USA',
        field_of_study: 'Computer Science',
        avg_salary: 120000,
        visa_success_rate: 0.85,
        demand_trend: 'High',
        top_skills: [
            { subject: 'AI/ML', A: 120, fullMark: 150 },
            { subject: 'Cloud (AWS)', A: 98, fullMark: 150 },
            { subject: 'React/Next', A: 86, fullMark: 150 },
            { subject: 'Data Eng', A: 99, fullMark: 150 },
            { subject: 'Cybersec', A: 85, fullMark: 150 },
            { subject: 'DevOps', A: 65, fullMark: 150 },
        ],
        financial_forecast: [
            { year: '2025', debt: 40000, earnings: 0 },
            { year: '2026', debt: 55000, earnings: 0 }, // Grad School
            { year: '2027', debt: 45000, earnings: 95000 }, // Job Start
            { year: '2028', debt: 20000, earnings: 110000 },
            { year: '2029', debt: 0, earnings: 135000 },    // Break Even
            { year: '2030', debt: 0, earnings: 150000 },
            { year: '2031', debt: 0, earnings: 165000 },
        ]
    },
    // Add other countries as needed...
];

let mockChatHistory: ChatMessage[] = [];
let mockAppointments: Appointment[] = [];

// Services
export const studentService = {
    getProfile: async (id: string): Promise<Student | undefined> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockStudents.find(s => s.id === id);
    },
    getAllStudents: async (): Promise<Student[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockStudents;
    }
};

export const chatService = {
    getHistory: async (studentId: string): Promise<ChatMessage[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockChatHistory.filter(c => c.student_id === studentId);
    },
    addMessage: async (message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage> => {
        const newMessage = { ...message, id: uuidv4(), created_at: new Date().toISOString() };
        mockChatHistory.push(newMessage);
        return newMessage;
    }
};

export const appointmentService = {
    createAppointment: async (studentId: string, date: string): Promise<Appointment> => {
        const newAppointment: Appointment = {
            id: uuidv4(),
            student_id: studentId,
            status: 'Pending',
            date,
            created_at: new Date().toISOString()
        };
        mockAppointments.push(newAppointment);
        return newAppointment;
    },
    getAppointments: async (): Promise<Appointment[]> => {
        return mockAppointments;
    },
    updateStatus: async (id: string, status: 'Pending' | 'Validated' | 'Completed'): Promise<Appointment | undefined> => {
        const app = mockAppointments.find(a => a.id === id);
        if (app) app.status = status;
        return app;
    }
};

export const marketDataService = {
    getData: async (country: string, field: string): Promise<MarketData | undefined> => {
        return mockMarketData.find(d => d.country === country && d.field_of_study === field);
    }
};
