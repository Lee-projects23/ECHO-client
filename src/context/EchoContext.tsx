import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ViewMode,
  Language,
  ClientProfile,
  MaintenanceRecord,
  RaisedActivity,
  Quotation,
  Invoice,
  Bill,
  Voucher,
  PaymentTransaction,
  ChatGroup,
  DocumentItem,
  NotificationItem,
  ChatMessage,
} from '../types/echo';
import {
  initialClientProfile,
  initialMaintenanceRecords,
  initialRaisedActivities,
  initialQuotations,
  initialInvoices,
  initialBills,
  initialVouchers,
  initialPayments,
  initialChatGroups,
  initialDocuments,
  initialNotifications,
} from '../data/mockData';

interface EchoContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedActivityId: string | null;
  setSelectedActivityId: (id: string | null) => void;
  selectedMaintenanceId: string | null;
  setSelectedMaintenanceId: (id: string | null) => void;
  selectedInvoiceToPay: Invoice | null;
  setSelectedInvoiceToPay: (inv: Invoice | null) => void;
  selectedQuotation: Quotation | null;
  setSelectedQuotation: (q: Quotation | null) => void;
  selectedTransaction: PaymentTransaction | null;
  setSelectedTransaction: (t: PaymentTransaction | null) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  client: ClientProfile;
  maintenance: MaintenanceRecord[];
  activities: RaisedActivity[];
  quotations: Quotation[];
  invoices: Invoice[];
  bills: Bill[];
  vouchers: Voucher[];
  payments: PaymentTransaction[];
  chatGroups: ChatGroup[];
  documents: DocumentItem[];
  notifications: NotificationItem[];
  raiseActivity: (data: {
    site_id: string;
    siteName: string;
    problem: string;
    description: string;
    clientNotes?: string;
    photos: string[];
    voiceNote?: { duration: string; url?: string; recordedAt: string };
  }) => string;
  trackActivityByCode: (code: string) => RaisedActivity | undefined;
  makePayment: (
    invoiceId: string,
    amount: number,
    method: string
  ) => { success: boolean; transaction: PaymentTransaction };
  sendChatMessage: (groupId: string, text: string, attachment?: ChatMessage['attachment']) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  acceptQuotation: (id: string) => void;
}

const EchoContext = createContext<EchoContextType | undefined>(undefined);

export const EchoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('echo_authenticated') === 'true';
  });
  const [currentView, setCurrentView] = useState<ViewMode>('welcome');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<string | null>(null);
  const [selectedInvoiceToPay, setSelectedInvoiceToPay] = useState<Invoice | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');

  // Theme setup with localStorage persistence
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('echo_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Defaulting to refined Obsidian dark
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('echo_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // State collections initialized
  const [client] = useState<ClientProfile>(initialClientProfile);
  const [maintenance] = useState<MaintenanceRecord[]>(initialMaintenanceRecords);
  const [activities, setActivities] = useState<RaisedActivity[]>(initialRaisedActivities);
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [bills] = useState<Bill[]>(initialBills);
  const [vouchers] = useState<Voucher[]>(initialVouchers);
  const [payments, setPayments] = useState<PaymentTransaction[]>(initialPayments);
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>(initialChatGroups);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('echo_authenticated', 'true');
    setCurrentView('home');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('echo_authenticated');
    setCurrentView('welcome');
    setIsSidebarOpen(false);
  };

  const raiseActivity = (data: {
    site_id: string;
    siteName: string;
    problem: string;
    description: string;
    clientNotes?: string;
    photos: string[];
    voiceNote?: { duration: string; url?: string; recordedAt: string };
  }): string => {
    const nextNum = 482 + activities.length - 2;
    const code = `RA-00${nextNum}`;
    const newActivity: RaisedActivity = {
      activity_id: `act-${Date.now()}`,
      code,
      client_id: client.client_id,
      site_id: data.site_id,
      siteName: data.siteName,
      problem: data.problem,
      description: data.description,
      clientNotes: data.clientNotes,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Raised',
      photos: data.photos,
      voiceNote: data.voiceNote,
      timeline: [
        {
          timestamp: `Today — ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          title: 'Activity Raised',
          description: 'Client submitted ticket with evidence.',
          actor: 'Client',
        },
      ],
    };

    setActivities(prev => [newActivity, ...prev]);

    // Push notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Activity Raised — ${code}`,
      description: `Your complaint for ${data.siteName} has been queued for Admin review.`,
      time: 'Just now',
      read: false,
      targetView: 'activity-detail',
      targetId: code,
    };
    setNotifications(prev => [newNotif, ...prev]);

    return code;
  };

  const trackActivityByCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    return activities.find(a => a.code.toUpperCase() === clean);
  };

  const makePayment = (
    invoiceId: string,
    amount: number,
    method: string
  ): { success: boolean; transaction: PaymentTransaction } => {
    const targetInvoice = invoices.find(inv => inv.invoice_id === invoiceId);
    if (!targetInvoice) {
      throw new Error('Invoice not found');
    }

    const newPaidAmount = targetInvoice.paidAmount + amount;
    const newBalance = Math.max(0, targetInvoice.amount - newPaidAmount);
    const newStatus = newBalance <= 0 ? 'Paid' : 'Partially Paid';

    // Update invoice
    setInvoices(prev =>
      prev.map(inv =>
        inv.invoice_id === invoiceId
          ? {
              ...inv,
              paidAmount: newPaidAmount,
              balance: newBalance,
              status: newStatus,
            }
          : inv
      )
    );

    const txnId = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const now = new Date();
    const newTxn: PaymentTransaction = {
      payment_id: `pay-${Date.now()}`,
      transactionId: txnId,
      invoiceNumber: targetInvoice.invoiceNumber,
      invoice_id: targetInvoice.invoice_id,
      date: 'Today',
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount,
      method,
      status: 'Success',
      referenceNote: `Payment via in-app gateway settlement. Authorized by ${client.name}`,
    };

    setPayments(prev => [newTxn, ...prev]);

    // Add receipt document
    const newReceiptDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: `Payment Receipt — ${txnId}`,
      type: 'Receipt',
      referenceNo: txnId,
      date: 'Today',
      fileSize: '320 KB PDF',
    };
    setDocuments(prev => [newReceiptDoc, ...prev]);

    // Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Payment Confirmed — ₹${amount.toLocaleString('en-IN')}`,
      description: `Settlement for ${targetInvoice.invoiceNumber} recorded. Status is now ${newStatus}.`,
      time: 'Just now',
      read: false,
      targetView: 'payments',
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, transaction: newTxn };
  };

  const sendChatMessage = (
    groupId: string,
    text: string,
    attachment?: ChatMessage['attachment']
  ) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'client-vikram',
      senderName: client.name,
      senderRole: 'client',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment,
    };

    setChatGroups(prev =>
      prev.map(grp => {
        if (grp.groupId === groupId) {
          return {
            ...grp,
            lastMessage: `You: ${text || (attachment ? attachment.name : 'Sent attachment')}`,
            lastMessageTime: 'Just now',
            messages: [...grp.messages, newMsg],
          };
        }
        return grp;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const acceptQuotation = (quotationId: string) => {
    setQuotations(prev =>
      prev.map(q => (q.quotation_id === quotationId ? { ...q, status: 'Accepted' } : q))
    );
    const targetQ = quotations.find(q => q.quotation_id === quotationId);
    if (targetQ) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: `Quotation Accepted — ${targetQ.quotationNumber}`,
          description: `You accepted ${targetQ.description}. Admin notified to issue work order.`,
          time: 'Just now',
          read: false,
          targetView: 'bill-book',
        },
        ...prev,
      ]);
    }
  };

  return (
    <EchoContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedActivityId,
        setSelectedActivityId,
        selectedMaintenanceId,
        setSelectedMaintenanceId,
        selectedInvoiceToPay,
        setSelectedInvoiceToPay,
        selectedQuotation,
        setSelectedQuotation,
        selectedTransaction,
        setSelectedTransaction,
        isSidebarOpen,
        setIsSidebarOpen,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        theme,
        toggleTheme,
        language,
        setLanguage,
        isAuthenticated,
        login,
        logout,
        client,
        maintenance,
        activities,
        quotations,
        invoices,
        bills,
        vouchers,
        payments,
        chatGroups,
        documents,
        notifications,
        raiseActivity,
        trackActivityByCode,
        makePayment,
        sendChatMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        acceptQuotation,
      }}
    >
      {children}
    </EchoContext.Provider>
  );
};

export const useEcho = () => {
  const context = useContext(EchoContext);
  if (!context) {
    throw new Error('useEcho must be used within an EchoProvider');
  }
  return context;
};
