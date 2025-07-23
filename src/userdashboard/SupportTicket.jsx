import React, { useState } from 'react';
import { FaTicketAlt, FaTag, FaClipboardList, FaFileAlt, FaPaperclip, FaCheckCircle, FaExclamationCircle, FaTimes, FaHashtag, FaHourglassHalf, FaEye, FaCalendarAlt, FaBoxOpen, FaCommentDots, FaTrashAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// --- Helper to get status badge styling ---
const getStatusBadge = (status) => {
  let colorClass = '';
  let icon = null;
  switch (status) {
    case 'Open':
      colorClass = 'bg-blue-100 text-blue-700';
      icon = <FaHourglassHalf className="inline mr-1" />;
      break;
    case 'In Progress':
      colorClass = 'bg-yellow-100 text-yellow-700';
      icon = <FaHourglassHalf className="inline mr-1" />;
      break;
    case 'Resolved':
      colorClass = 'bg-emerald-100 text-emerald-700';
      icon = <FaCheckCircle className="inline mr-1" />;
      break;
    case 'Closed':
      colorClass = 'bg-gray-200 text-gray-700';
      icon = <FaTimes className="inline mr-1" />;
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-700';
      icon = <FaCommentDots className="inline mr-1" />;
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {icon} {status}
    </span>
  );
};

// --- CreateTicketForm Component ---
const CreateTicketForm = ({ categories, onSubmit, isSubmitting, submitSuccess, errors }) => {
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    orderId: '',
    description: '',
    attachment: null,
  });

  // Reset form when submitSuccess changes to true (after successful submission)
  React.useEffect(() => {
    if (submitSuccess) {
      setFormData({
        subject: '',
        category: '',
        orderId: '',
        description: '',
        attachment: null,
      });
    }
  }, [submitSuccess]);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachment') {
      setFormData(prev => ({ ...prev, attachment: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass current form data to parent handler
  };

  return (
    <form onSubmit={handleSubmitInternal} className="space-y-4"> {/* Reduced space-y */}
      {/* Subject Field */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/70 shadow-lg"> {/* Reduced padding */}
        <label htmlFor="subject" className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 flex items-center"> {/* Reduced mb */}
          <FaTag className="mr-1.5 text-gray-500 text-sm" /> Subject / Topic
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="e.g., Issue with recent order"
          className={`w-full p-2 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base
                      ${errors.subject ? 'border-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'}
                      bg-white shadow-sm focus:shadow-md`}
        />
        {errors.subject && <p className="text-red-500 text-xs mt-0.5">{errors.subject}</p>} {/* Reduced mt */}
      </div>

      {/* Category Field */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/70 shadow-lg"> {/* Reduced padding */}
        <label htmlFor="category" className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 flex items-center">
          <FaClipboardList className="mr-1.5 text-gray-500 text-sm" /> Category
        </label>
        <div className="relative">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base
                        ${errors.category ? 'border-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'}
                        bg-white shadow-sm focus:shadow-md appearance-none pr-8`}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value} disabled={cat.value === ''}>
                {cat.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <FaTimes className="text-xs rotate-45" />
          </div>
        </div>
        {errors.category && <p className="text-red-500 text-xs mt-0.5">{errors.category}</p>}
      </div>

      {/* Order ID Field (Conditional) */}
      {(formData.category === 'Order Issue' || formData.category === 'Delivery Issue' || formData.category === 'Payment Issue') && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/70 shadow-lg animate-fade-in">
          <label htmlFor="orderId" className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 flex items-center">
            <FaHashtag className="mr-1.5 text-gray-500 text-sm" /> Order ID (Optional)
          </label>
          <input
            type="text"
            id="orderId"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            placeholder="e.g., ORD123456"
            className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
                       bg-white shadow-sm focus:shadow-md text-sm sm:text-base"
          />
        </div>
      )}

      {/* Description Field */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/70 shadow-lg">
        <label htmlFor="description" className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 flex items-center">
          <FaFileAlt className="mr-1.5 text-gray-500 text-sm" /> Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4" // Reduced rows for compactness
          placeholder="Please describe your query in detail..."
          className={`w-full p-2 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base
                      ${errors.description ? 'border-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'}
                      bg-white shadow-sm focus:shadow-md resize-y`}
        ></textarea>
        {errors.description && <p className="text-red-500 text-xs mt-0.5">{errors.description}</p>}
      </div>

      {/* Attachment Field */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/70 shadow-lg">
        <label htmlFor="attachment" className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 flex items-center">
          <FaPaperclip className="mr-1.5 text-gray-500 text-sm" /> Attach File (Optional)
        </label>
        <input
          type="file"
          id="attachment"
          name="attachment"
          onChange={handleChange}
          className="w-full text-xs sm:text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3
                     file:rounded-full file:border-0 file:text-xs file:font-semibold
                     file:bg-emerald-50 file:text-emerald-700
                     hover:file:bg-emerald-100 cursor-pointer"
        />
        {formData.attachment && (
          <p className="text-gray-600 text-xs mt-1">Attached: {formData.attachment.name}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center px-4 py-2.5 rounded-full text-base font-bold
                    transition-all duration-300 shadow-lg
                    ${isSubmitting ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-98'}`}
      >
        {isSubmitting ? (
          <>
            <FaHourglassHalf className="animate-spin mr-2" /> Submitting...
          </>
        ) : (
          <>
            <FaTicketAlt className="mr-2" /> Submit Ticket
          </>
        )}
      </button>
    </form>
  );
};

// --- ViewTicketsList Component ---
const ViewTicketsList = ({ tickets, onDeleteTicket, currentPage, setCurrentPage, ticketsPerPage }) => {
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4">
      {currentTickets.length > 0 ? (
        currentTickets.map(ticket => (
          <div key={ticket.id} className="bg-white rounded-xl shadow-lg p-2 border border-gray-100 transition-all duration-200 hover:shadow-xl hover:scale-[1.01]">
            <div className="flex justify-between items-start mb-3"> {/* Changed to items-start for better alignment with delete */}
              <h3 className="text-md sm:text-lg font-bold text-gray-900 flex items-center">
                <FaTicketAlt className="mr-2 text-emerald-600 text-lg" /> {ticket.id}
              </h3>
              <div className="flex items-center space-x-2">
                {getStatusBadge(ticket.status)}
                <button
                  onClick={() => onDeleteTicket(ticket.id)}
                  className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors active:scale-95"
                  aria-label={`Delete ticket ${ticket.id}`}
                >
                  <FaTrashAlt className="text-sm" /> {/* Smaller delete icon */}
                </button>
              </div>
            </div>
            <p className="text-gray-800 font-semibold text-sm sm:text-base mb-1 line-clamp-1">{ticket.subject}</p>
            <p className="text-gray-600 text-xs mb-2">Category: {ticket.category}</p>
            <div className="flex justify-between items-center text-gray-500 text-xs">
              <span>Created: {ticket.date}</span>
              <span>Last Update: {ticket.lastUpdate}</span>
            </div>
            <button className="mt-3 w-full bg-emerald-50 text-emerald-700 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors">
              View Details
            </button>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-600 text-sm">
          <p>You haven't created any support tickets yet.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {tickets.length > ticketsPerPage && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-full bg-emerald-600 text-white transition-all duration-200
                        ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700 active:scale-95'}`}
            aria-label="Previous page"
          >
            <FaChevronLeft className="text-lg" />
          </button>
          <span className="text-gray-700 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={indexOfLastTicket >= tickets.length}
            className={`p-2 rounded-full bg-emerald-600 text-white transition-all duration-200
                        ${indexOfLastTicket >= tickets.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700 active:scale-95'}`}
            aria-label="Next page"
          >
            <FaChevronRight className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main SupportTicket Component ---
const SupportTicket = () => {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'view'
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [tickets, setTickets] = useState([ // Moved mockTickets to state
    {
      id: 'TKT001',
      subject: 'Issue with recent order delivery',
      category: 'Delivery Issue',
      status: 'In Progress',
      date: '2025-07-18',
      lastUpdate: '2025-07-19',
    },
    {
      id: 'TKT002',
      subject: 'Query about organic fertilizer usage',
      category: 'Product Query',
      status: 'Resolved',
      date: '2025-07-10',
      lastUpdate: '2025-07-12',
    },
    {
      id: 'TKT003',
      subject: 'Payment gateway error on checkout',
      category: 'Payment Issue',
      status: 'Open',
      date: '2025-07-20',
      lastUpdate: '2025-07-20',
    },
    {
      id: 'TKT004',
      subject: 'Feedback on website navigation',
      category: 'Feedback',
      status: 'Closed',
      date: '2025-06-30',
      lastUpdate: '2025-07-05',
    },
    {
      id: 'TKT005',
      subject: 'Login issue on mobile app',
      category: 'Technical Support',
      status: 'Open',
      date: '2025-07-19',
      lastUpdate: '2025-07-19',
    },
    {
      id: 'TKT006',
      subject: 'Question about return policy',
      category: 'Other',
      status: 'Open',
      date: '2025-07-17',
      lastUpdate: '2025-07-17',
    },
    {
      id: 'TKT007',
      subject: 'Product availability check',
      category: 'Product Query',
      status: 'Resolved',
      date: '2025-07-15',
      lastUpdate: '2025-07-16',
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;


  const categories = [
    { value: '', label: 'Select a category' },
    { value: 'Order Issue', label: 'Order Issue' },
    { value: 'Product Query', label: 'Product Query' },
    { value: 'Delivery Issue', label: 'Delivery Issue' },
    { value: 'Payment Issue', label: 'Payment Issue' },
    { value: 'Technical Support', label: 'Technical Support' },
    { value: 'Feedback', label: 'Feedback' },
    { value: 'Other', label: 'Other' },
  ];

  const validateForm = (formData) => {
    let newErrors = {};
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required.';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitTicket = async (formDataToSubmit) => {
    if (!validateForm(formDataToSubmit)) {
      return;
    }

    // Simulate API call
    console.log('Submitting ticket:', formDataToSubmit);
    // In a real application, you would send formDataToSubmit to your backend here
    // e.g., await fetch('/api/submit-ticket', { method: 'POST', body: JSON.stringify(formDataToSubmit) });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Add new ticket to the list (mocking ID and date)
    const newTicket = {
      id: `TKT${String(tickets.length + 1).padStart(3, '0')}`,
      subject: formDataToSubmit.subject,
      category: formDataToSubmit.category,
      status: 'Open', // Default status for new tickets
      date: new Date().toISOString().slice(0, 10), // Current date
      lastUpdate: new Date().toISOString().slice(0, 10), // Current date
    };
    setTickets(prevTickets => [newTicket, ...prevTickets]); // Add to the beginning of the list

    setSubmitSuccess(true);
    // Optionally switch to 'view' tab after successful submission
    setActiveTab('view');
    setCurrentPage(1); // Go to the first page to see the new ticket
    setTimeout(() => setSubmitSuccess(false), 3000); // Hide success message
  };

  const handleDeleteTicket = (ticketId) => {
    // In a real app, you'd send a delete request to your backend
    console.log(`Deleting ticket: ${ticketId}`);
    setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
    // After deletion, re-evaluate current page to avoid empty page if last item on page was deleted
    if (currentPage > Math.ceil((tickets.length - 1) / ticketsPerPage) && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center sm:p-2 font-sans">
      <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-2 sm:p-8 md:p-10 w-full max-w-2xl border border-white/50">

        {/* Success/Error Message */}
        {submitSuccess && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold animate-fade-in-down z-20 flex items-center">
            <FaCheckCircle className="mr-2" /> Ticket Submitted Successfully!
          </div>
        )}
        {Object.keys(errors).length > 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold animate-fade-in-down z-20 flex items-center">
            <FaExclamationCircle className="mr-2" /> Please fill in all required fields.
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-16"> {/* Reduced mb */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <FaTicketAlt className="mr-3 text-emerald-600" /> Support
          </h1>
        </div>

        {/* Animated Tabs for Sections */}
        <div className="mb-6 bg-white/60 backdrop-blur-sm rounded-xl p-1 flex border border-white/70 shadow-inner">
          <button
            onClick={() => { setActiveTab('create'); setErrors({}); }} // Clear errors when switching tabs
            className={`flex-1 py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300
                        ${activeTab === 'create' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-white/70'}`}
          >
            Create Ticket
          </button>
          <button
            onClick={() => { setActiveTab('view'); setErrors({}); }} // Clear errors when switching tabs
            className={`flex-1 py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300
                        ${activeTab === 'view' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-white/70'}`}
          >
            View Tickets
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 pt-0 rounded-2xl min-h-screen bg-white/60 backdrop-blur-sm border border-white/70 shadow-lg animate-fade-in"> {/* Added padding, rounded */}
          {activeTab === 'create' && (
            <CreateTicketForm
              categories={categories}
              onSubmit={handleSubmitTicket}
              isSubmitting={false} // isSubmitting state is managed internally by CreateTicketForm for its button
              submitSuccess={submitSuccess}
              errors={errors}
            />
          )}

          {activeTab === 'view' && (
            <ViewTicketsList
              tickets={tickets}
              onDeleteTicket={handleDeleteTicket}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              ticketsPerPage={ticketsPerPage}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default SupportTicket;