import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../../api/axios';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import inboxIcon from '../../assets/icons/inbox.svg';
import draftIcon from '../../assets/icons/draft.svg';
import contentIcon from '../../assets/icons/content.svg';
import searchIcon from '../../assets/icons/search.svg';
import uploadIcon from '../../assets/icons/upload.svg';

interface Question {
  id: number;
  patientName: string;
  patientAvatar?: string;
  subject: string;
  content: string;
  status: 'pending' | 'answered' | 'reviewing';
  priority: 'high' | 'medium' | 'low';
  category: string;
  createdAt: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  response?: {
    content: string;
    answeredAt: string;
    attachments?: {
      name: string;
      url: string;
      type: string;
    }[];
  };
}

const QuestionInbox: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [responseContent, setResponseContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered' | 'reviewing'>('all');
  const [loading, setLoading] = useState(false);
  const [responseAttachments, setResponseAttachments] = useState<File[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockQuestions: Question[] = [
      {
        id: 1,
        patientName: "Nguyễn Thị An",
        subject: "Câu hỏi về rối loạn kinh nguyệt",
        content: "Bác sĩ ơi, em bị rối loạn kinh nguyệt 3 tháng nay, chu kỳ không đều và lượng máu kinh nhiều hơn bình thường. Em nên làm gì ạ?",
        status: "pending",
        priority: "high",
        category: "Kinh nguyệt",
        createdAt: "2025-06-14T10:30:00Z"
      },
      {
        id: 2,
        patientName: "Trần Thị Bình",
        subject: "Tư vấn về việc sử dụng thuốc tránh thai",
        content: "Em muốn hỏi về các loại thuốc tránh thai và tác dụng phụ của chúng. Em nên chọn loại nào phù hợp?",
        status: "answered",
        priority: "medium",
        category: "Tránh thai",
        createdAt: "2025-06-13T15:45:00Z",
        response: {
          content: "Chào bạn, việc lựa chọn thuốc tránh thai cần dựa trên nhiều yếu tố như tuổi, tình trạng sức khỏe và tiền sử bệnh. Tôi đề xuất bạn nên đặt lịch tư vấn trực tiếp để được khám và tư vấn chi tiết hơn.",
          answeredAt: "2025-06-13T16:30:00Z"
        }
      },
      {
        id: 3,
        patientName: "Lê Thị Cúc",
        subject: "Triệu chứng đau bụng dưới",
        content: "Em bị đau bụng dưới kèm theo ra khí hư bất thường. Em lo lắng không biết có phải bị viêm phụ khoa không?",
        status: "reviewing",
        priority: "high",
        category: "Phụ khoa",
        createdAt: "2025-06-15T08:15:00Z"
      }
    ];
    setQuestions(mockQuestions);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilter = (status: typeof filter) => {
    setFilter(status);
  };

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setResponseContent(question.response?.content || '');
  };
  const handleSubmitResponse = async () => {
    if (!selectedQuestion || !responseContent.trim()) return;

    const shouldSubmit = window.confirm('Bạn có chắc chắn muốn gửi câu trả lời này?');
    if (!shouldSubmit) {
      return;
    }

    try {
      setLoading(true);
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedQuestion = {
        ...selectedQuestion,
        status: 'answered' as const,
        response: {
          content: responseContent,
          answeredAt: new Date().toISOString(),
          attachments: responseAttachments.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type
          }))
        }
      };

      setQuestions(prev =>
        prev.map(q => q.id === selectedQuestion.id ? updatedQuestion : q)
      );
      setSelectedQuestion(updatedQuestion);
      setResponseAttachments([]);

    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setResponseAttachments(prev => [...prev, ...files]);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || q.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: Question['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
    }
  };

  const getStatusBadgeVariant = (status: Question['status']): 'warning' | 'success' | 'info' | 'primary' => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'answered':
        return 'success';
      case 'reviewing':
        return 'info';
      default:
        return 'primary';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Hộp thư câu hỏi</h1>
          <p className="text-gray-600">Quản lý và trả lời các câu hỏi từ bệnh nhân</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Questions list */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Search and filter */}
            <div className="p-4 border-b">
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm câu hỏi..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <img
                    src={searchIcon}
                    alt="search"
                    className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'secondary'}
                  onClick={() => handleFilter('all')}
                >
                  Tất cả
                </Button>
                <Button
                  variant={filter === 'pending' ? 'primary' : 'secondary'}
                  onClick={() => handleFilter('pending')}
                >
                  Chờ trả lời
                </Button>
                <Button
                  variant={filter === 'answered' ? 'primary' : 'secondary'}
                  onClick={() => handleFilter('answered')}
                >
                  Đã trả lời
                </Button>
              </div>
            </div>

            {/* Questions list */}
            <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredQuestions.map(question => (
                <div
                  key={question.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                    selectedQuestion?.id === question.id ? 'bg-pink-50' : ''
                  }`}
                  onClick={() => handleSelectQuestion(question)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{question.subject}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{question.content}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(question.status)}>
                      {question.status === 'pending' ? 'Chờ trả lời' :
                       question.status === 'answered' ? 'Đã trả lời' : 'Đang xem xét'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{question.patientName}</span>
                    <span className="text-gray-500">
                      {format(new Date(question.createdAt), 'HH:mm dd/MM/yyyy')}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(question.priority)}`}>
                      {question.priority === 'high' ? 'Ưu tiên cao' :
                       question.priority === 'medium' ? 'Ưu tiên vừa' : 'Ưu tiên thấp'}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {question.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Question detail and response */}
          <div className="lg:col-span-2">
            {selectedQuestion ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                {/* Question detail */}
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{selectedQuestion.subject}</h2>
                      <p className="text-gray-600">
                        Từ: {selectedQuestion.patientName} • 
                        {format(new Date(selectedQuestion.createdAt), 'HH:mm dd/MM/yyyy')}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(selectedQuestion.status)}>
                      {selectedQuestion.status === 'pending' ? 'Chờ trả lời' :
                       selectedQuestion.status === 'answered' ? 'Đã trả lời' : 'Đang xem xét'}
                    </Badge>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedQuestion.content}</p>
                  </div>
                  {selectedQuestion.attachments && selectedQuestion.attachments.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Tệp đính kèm:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedQuestion.attachments.map((file, index) => (
                          <a
                            key={index}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200"
                          >
                            <img src={contentIcon} alt="file" className="w-4 h-4" />
                            {file.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Previous response if exists */}
                {selectedQuestion.response && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Câu trả lời trước:</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedQuestion.response.content}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Trả lời lúc: {format(new Date(selectedQuestion.response.answeredAt), 'HH:mm dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Response form */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Trả lời:</h3>
                  <textarea
                    className="w-full p-4 border rounded-lg mb-4 min-h-[150px]"
                    placeholder="Nhập câu trả lời của bạn..."
                    value={responseContent}
                    onChange={(e) => setResponseContent(e.target.value)}
                  />
                  
                  {/* File attachments */}
                  {responseAttachments.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tệp đính kèm:</h4>
                      <div className="flex flex-wrap gap-2">
                        {responseAttachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm"
                          >
                            <img src={contentIcon} alt="file" className="w-4 h-4" />
                            <span className="text-gray-600">{file.name}</span>
                            <button
                              onClick={() => {
                                setResponseAttachments(prev => prev.filter((_, i) => i !== index));
                              }}
                              className="text-red-500 hover:text-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        onClick={handleSubmitResponse}
                        disabled={loading || !responseContent.trim()}
                      >
                        {loading ? 'Đang gửi...' : 'Gửi câu trả lời'}
                      </Button>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                          <img src={uploadIcon} alt="upload" className="w-5 h-5" />
                          <span>Đính kèm tệp</span>
                        </div>
                      </label>
                    </div>
                    <Button                      variant="secondary"
                      onClick={() => {
                        const draft = responseContent.trim();
                        if (draft) {
                          if (window.confirm('Bạn có muốn hủy bản nháp?')) {
                            setResponseContent('');
                            setResponseAttachments([]);
                          }
                        } else {
                          setResponseContent('');
                          setResponseAttachments([]);
                        }
                      }}
                    >
                      Xóa bản nháp
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <img src={inboxIcon} alt="inbox" className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Chọn một câu hỏi</h2>
                <p className="text-gray-600">Chọn một câu hỏi từ danh sách bên trái để xem chi tiết và trả lời</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionInbox;
