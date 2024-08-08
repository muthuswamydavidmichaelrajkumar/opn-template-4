import React, { useState, useEffect } from 'react';
import { Search, User, ChevronDown, ChevronRight, Book, FileText, HelpCircle, Terminal, Clock, Leaf } from 'lucide-react';

const OpnDocsUI = () => {
  const [activePage, setActivePage] = useState('Documents');
  const [activeSubPage, setActiveSubPage] = useState('');
  const [selectedAPIVersion, setSelectedAPIVersion] = useState('v1.0');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rating, setRating] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedItems, setExpandedItems] = useState({});
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, text: "Great documentation!", date: new Date('2024-03-01'), isOpen: true },
    { id: 2, text: "Could use more examples.", date: new Date('2024-03-02'), isOpen: true }
  ]);

  const mainMenuItems = [
    { name: 'Documents', icon: Book },
    { name: 'Articles', icon: FileText },
    { name: 'FAQs', icon: HelpCircle },
    { name: 'API Playground', icon: Terminal },
    { name: 'Changelog', icon: Clock }
  ];

  const sidebarItems = {
    Documents: {
      Guides: {
        'Getting Started': ['Quick Start', 'Installation'],
        'Authentication': ['OAuth', 'API Keys']
      },
      'Payment Methods': {
        'Credit Card': ['Visa', 'Mastercard'],
        'Bank Transfer': ['ACH', 'SEPA']
      },
      'API References': {
        'Customers': ['Create', 'Retrieve', 'Update', 'Delete'],
        'Charges': ['Create', 'Capture', 'Refund']
      }
    },
    Articles: {
      Billing: {
        'Invoices': ['Generation', 'Management'],
        'Pricing': ['Models', 'Strategies'],
        'Subscriptions': ['Setup', 'Recurring Payments']
      },
      Payments: {
        'Processing': ['Authorization', 'Capture'],
        'Settlements': ['Timelines', 'Reconciliation'],
        'Disputes': ['Chargebacks', 'Fraud Prevention']
      },
      Security: {
        'PCI Compliance': ['Requirements', 'Implementation'],
        'Fraud Prevention': ['Tools', 'Best Practices'],
        'Data Protection': ['Encryption', 'GDPR Compliance']
      }
    },
    FAQs: {
      Billing: {
        'Account Setup': ['Registration', 'Verification'],
        'Billing Cycle': ['Frequency', 'Adjustments'],
        'Payment Issues': ['Declined Transactions', 'Retries']
      },
      Payments: {
        'Transaction Fees': ['Calculation', 'Optimization'],
        'Refund Policy': ['Timeframes', 'Eligibility'],
        'Currency Support': ['Conversion', 'Settlement']
      },
      Security: {
        'Account Security': ['Two-Factor Authentication', 'Password Policy'],
        'Data Encryption': ['In-Transit', 'At-Rest'],
        'Compliance Standards': ['PCI-DSS', 'ISO 27001']
      }
    },
    Changelog: {
      '2024': {
        'May': ['Updated smart controls', 'Enhanced API performance'],
        'April': ['New dashboard features', 'Bug fixes in reporting module'],
        'March': ['Launched mobile SDK', 'Improved documentation search']
      },
      '2023': {
        'December': ['Year-end security updates', 'New payment method integrations'],
        'November': ['Revamped user interface', 'Optimized database queries'],
        'October': ['Introduced multi-currency support', 'Enhanced fraud detection algorithms']
      }
    },
    'API Playground': {} // Empty object for API Playground to prevent errors
  };

  useEffect(() => {
    const currentSidebarItems = sidebarItems[activePage];
    if (currentSidebarItems && Object.keys(currentSidebarItems).length > 0) {
      const firstCategory = Object.keys(currentSidebarItems)[0];
      setActiveSubPage(firstCategory);
    } else {
      setActiveSubPage('');
    }
  }, [activePage]);

  const toggleExpand = (path) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { id: comments.length + 1, text: newComment, date: new Date(), isOpen: true }]);
      setNewComment('');
    }
  };

  const toggleComment = (id) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, isOpen: !comment.isOpen } : comment
    ));
  };

  const renderSidebarItems = (items, path = '') => {
    if (!items || typeof items !== 'object') {
      return null;
    }

    return Object.entries(items).map(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      const isExpanded = expandedItems[currentPath];
      
      if (Array.isArray(value)) {
        return (
          <div key={currentPath} className="ml-4 my-2">
            <div 
              className="cursor-pointer hover:text-green-600 transition-colors duration-200"
              onClick={() => setActiveSubPage(key)}
            >
              {key}
            </div>
          </div>
        );
      } else if (typeof value === 'object') {
        return (
          <div key={currentPath} className="ml-4 my-2">
            <div 
              className="flex items-center cursor-pointer hover:text-green-600 transition-colors duration-200"
              onClick={() => {
                toggleExpand(currentPath);
                setActiveSubPage(key);
              }}
            >
              {isExpanded ? <ChevronDown size={16} className="text-green-500" /> : <ChevronRight size={16} className="text-green-500" />}
              <span className="ml-2">{key}</span>
            </div>
            {isExpanded && (
              <div className="ml-4">
                {renderSidebarItems(value, currentPath)}
              </div>
            )}
          </div>
        );
      }
      return null;
    });
  };

  const renderSidebar = () => {
    if (!sidebarOpen || activePage === 'API Playground') return null;

    const currentSidebarItems = sidebarItems[activePage];
    if (!currentSidebarItems || Object.keys(currentSidebarItems).length === 0) return null;

    return (
      <div className="w-64 bg-green-50 p-4 h-screen overflow-y-auto rounded-tr-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-700">{activePage}</h2>
        {renderSidebarItems(currentSidebarItems)}
      </div>
    );
  };

  const renderMainContent = () => {
    const sortedComments = [...comments].sort((a, b) => 
      sortOrder === 'desc' ? b.date - a.date : a.date - b.date
    );

    return (
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <h2 className="text-3xl font-bold mb-4 text-green-700">{activeSubPage || activePage}</h2>
        <p className="text-gray-600">Content for {activeSubPage || activePage} in {activePage} goes here...</p>
        
        {activePage !== 'API Playground' && (
          <div className="mt-4 flex space-x-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="p-2 border rounded-full bg-white text-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="English">English</option>
              <option value="Japanese">日本語</option>
              <option value="Thai">ไทย</option>
            </select>

            {activePage === 'Documents' && (
              <select
                value={selectedAPIVersion}
                onChange={(e) => setSelectedAPIVersion(e.target.value)}
                className="p-2 border rounded-full bg-white text-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option>v1.0</option>
                <option>v2.0</option>
                <option>v3.0</option>
              </select>
            )}
          </div>
        )}

        <div className="mt-8 bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-green-700">Rate this content:</h3>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Leaf
                key={star}
                size={24}
                fill={star <= rating ? "#10B981" : "none"}
                stroke="#10B981"
                className="cursor-pointer mr-1"
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <p className="mt-2 text-gray-600">Overall rating: {rating}/5</p>
        </div>

        <div className="mt-8 bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-green-700">Comments</h3>
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-xl mb-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              rows="4"
              placeholder="Enter your comment..."
            ></textarea>
            <div className="flex items-center">
              <input
                type="text"
                className="flex-1 p-2 border rounded-l-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                placeholder="Enter CAPTCHA"
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-r-xl hover:bg-green-600 transition-colors duration-200">
                Post Comment
              </button>
            </div>
          </form>
          <div className="mt-4">
            <h4 className="font-semibold mb-2 text-green-700">All Comments</h4>
            <button
              className="text-green-600 underline mb-2 hover:text-green-800"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
            </button>
            {sortedComments.map((comment) => (
              <div key={comment.id} className="border-b py-2">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleComment(comment.id)}>
                  <p className="text-gray-600">{comment.isOpen ? '▼' : '▶'} {comment.date.toLocaleString()}</p>
                </div>
                {comment.isOpen && <p className="mt-2 text-gray-700">{comment.text}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mr-4">Opn Docs</h1>
          <span className="text-lg">{activePage} {activeSubPage ? `- ${activeSubPage}` : ''}</span>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search..."
              className="py-1 px-3 pr-8 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
          <User className="cursor-pointer" size={24} />
        </div>
      </div>

      {/* Main Menu */}
      <div className="bg-white p-2 flex justify-center shadow-md">
        {mainMenuItems.map((item) => (
          <button
            key={item.name}
            className={`px-4 py-2 rounded-full mx-2 flex items-center ${
              activePage === item.name 
                ? 'bg-green-100 text-green-700' 
                : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
            } transition-colors duration-200`}
            onClick={() => {
              setActivePage(item.name);
              setActiveSubPage('');
              setExpandedItems({});
            }}
          >
            <item.icon size={18} className="mr-2" />
            {item.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {renderSidebar()}
        {renderMainContent()}
      </div>
    </div>
  );
};

export default OpnDocsUI;