import React, { useEffect, useState } from 'react';
import { ArrowLeft, MessageSquare, Plus, Search } from 'lucide-react';
import { AppCard, Button, EmptyState, Input, Modal, StatusBadge, TextArea, Toast } from '@/components/ui';
import { supportService } from '@/services/support.service';
import type { Ticket } from '@/types/domain';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/routes/routePaths';
import { MOCK_FAQS } from '@/mocks/data';

export const SupportPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets'>('faq');
  const [search, setSearch] = useState('');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await supportService.getTickets(controller.signal);
        setTickets(data);
      } catch {
        setToast({ show: true, message: 'Unable to load tickets.' });
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const filteredFaq = MOCK_FAQS.filter(f => f.question.toLowerCase().includes(search.toLowerCase()));

  const handleSubmitTicket = async () => {
    try {
      await supportService.createTicket({ subject: ticketSubject, message: ticketMessage });
      setToast({ show: true, message: 'Ticket submitted.' });
    } catch {
      setToast({ show: true, message: 'Unable to submit ticket.' });
    } finally {
      setTicketSubject('');
      setTicketMessage('');
      setIsNewTicketOpen(false);
    }
  };

  return (
    <div className="pt-6 pb-20 min-h-screen bg-slate-50">
       <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
       <div className="flex items-center mb-6 pt-2">
         <button onClick={() => navigate(routePaths.user.account)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
           <ArrowLeft className="w-5 h-5 text-slate-600" />
         </button>
         <h1 className="text-xl font-bold text-slate-900 ml-2">Help Center</h1>
       </div>

       <div className="relative mb-6">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
         <input 
           type="text" 
           placeholder="Search for help..." 
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
         />
       </div>

       <div className="flex space-x-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
         {['faq', 'tickets'].map((tab) => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab as 'faq' | 'tickets')}
             className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
               activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
             }`}
           >
             {tab === 'faq' ? 'FAQ' : 'My Tickets'}
           </button>
         ))}
       </div>

       {activeTab === 'faq' ? (
         <div className="space-y-4">
            {filteredFaq.length > 0 ? filteredFaq.map(faq => (
              <AppCard key={faq.id} className="p-5">
                 <h4 className="font-bold text-slate-900 text-sm mb-2">{faq.question}</h4>
                 <p className="text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
                 <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium uppercase">{faq.category}</span>
                    <button className="text-xs text-primary-600 font-medium">Was this helpful?</button>
                 </div>
              </AppCard>
            )) : <EmptyState icon={<Search className="w-8 h-8 text-slate-300"/>} title="No results" description="Try a different keyword." />}
            
            <div className="pt-4">
               <h4 className="font-bold text-slate-900 text-sm mb-3">Still need help?</h4>
               <Button className="w-full" onClick={() => setIsNewTicketOpen(true)}>
                  <MessageSquare className="w-4 h-4 mr-2" /> Contact Support
               </Button>
            </div>
         </div>
       ) : (
         <div className="space-y-4">
            {tickets.map(ticket => (
               <AppCard key={ticket.id} className="cursor-pointer hover:border-primary-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-xs text-slate-400">#{ticket.id} • {ticket.date}</span>
                     <StatusBadge label={ticket.status} variant={ticket.status === 'Resolved' ? 'success' : ticket.status === 'Open' ? 'warning' : 'neutral'} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{ticket.subject}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{ticket.lastMessage}</p>
               </AppCard>
            ))}
            <Button className="w-full mt-4" variant="outline" onClick={() => setIsNewTicketOpen(true)}>
               <Plus className="w-4 h-4 mr-2" /> Create New Ticket
            </Button>
         </div>
       )}

       <Modal isOpen={isNewTicketOpen} onClose={() => setIsNewTicketOpen(false)} title="Contact Support">
          <div className="pb-safe space-y-4">
             <Input
               label="Subject"
               placeholder="Brief description of issue"
               value={ticketSubject}
               onChange={(e) => setTicketSubject(e.target.value)}
             />
             <TextArea
               label="Message"
               placeholder="Describe your issue in detail..."
               rows={4}
               value={ticketMessage}
               onChange={(e) => setTicketMessage(e.target.value)}
             />
             <div className="pt-2">
                <Button className="w-full" onClick={handleSubmitTicket}>Submit Ticket</Button>
             </div>
          </div>
       </Modal>
    </div>
  );
};
