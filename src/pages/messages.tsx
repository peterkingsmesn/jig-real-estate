import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  fromUser: {
    id: string;
    name: string;
    image?: string;
    email: string;
  };
  toUser: {
    id: string;
    name: string;
    image?: string;
    email: string;
  };
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  user: {
    id: string;
    name: string;
    image?: string;
    email: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState({ subject: '', content: '' });
  const [showCompose, setShowCompose] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    // 모의 데이터 로드
    loadConversations();
  }, [session, router]);

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.data.conversations || []);
      } else {
        console.error('Failed to load conversations');
        setConversations([]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/messages/user/${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data.messages || []);
      } else {
        console.error('Failed to load messages');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const handleConversationClick = (userEmail: string) => {
    setSelectedConversation(userEmail);
    loadMessages(userEmail);
  };

  const handleSendMessage = async () => {
    if (!newMessage.content.trim() || !recipientEmail.trim()) {
      alert('받는 사람과 메시지 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toEmail: recipientEmail,
          subject: newMessage.subject,
          content: newMessage.content
        }),
      });

      if (response.ok) {
        alert('메시지가 전송되었습니다.');
        setNewMessage({ subject: '', content: '' });
        setRecipientEmail('');
        setShowCompose(false);
        // 대화 목록 새로고침
        loadConversations();
      } else {
        const errorData = await response.json();
        alert(errorData.error?.message || '메시지 전송 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('메시지 전송 중 오류가 발생했습니다.');
    }
  };

  const sendReply = async () => {
    if (!replyMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch('/api/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedConversation,
          subject: 'Re: 답장',
          content: replyMessage,
          senderName: session?.user?.name || 'Anonymous'
        }),
      });

      if (response.ok) {
        toast.success('메시지가 전송되었습니다.');
        setReplyMessage('');
        
        // 메시지 목록에 즉시 추가
        const newMsg: Message = {
          id: Date.now().toString(),
          fromUser: {
            id: session?.user?.email || '',
            name: session?.user?.name || 'Anonymous',
            email: session?.user?.email || '',
            image: session?.user?.image || undefined
          },
          fromUserEmail: session?.user?.email || '',
          toUserEmail: selectedConversation,
          subject: 'Re: 답장',
          content: replyMessage,
          createdAt: new Date().toISOString(),
          isRead: true
        };
        
        setMessages(prev => [...prev, newMsg]);
      } else {
        toast.error('메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('메시지 전송 중 오류가 발생했습니다.');
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (!session) {
    return (
      <FacebookLayout>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600">쪽지를 확인하려면 먼저 로그인해주세요.</p>
        </div>
      </FacebookLayout>
    );
  }

  return (
    <>
      <SEOHead
        title="쪽지함 - 필직"
        description="다른 사용자들과 개인 메시지를 주고받으세요"
        keywords="쪽지, 메시지, 개인메시지, 필직"
      />

      <FacebookLayout>
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* 헤더 */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">쪽지함</h1>
                <button
                  onClick={() => setShowCompose(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>새 쪽지</span>
                </button>
              </div>

              {/* 탭 */}
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === 'inbox'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  받은 쪽지함
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === 'sent'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  보낸 쪽지함
                </button>
              </div>
            </div>

            <div className="flex h-96">
              {/* 대화 목록 */}
              <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">로딩 중...</p>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <p className="text-gray-600">대화가 없습니다</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.user.email}
                        onClick={() => handleConversationClick(conversation.user.email)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedConversation === conversation.user.email ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {conversation.user.image ? (
                            <img
                              src={conversation.user.image}
                              alt={conversation.user.name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {conversation.user.name}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage.content}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(conversation.lastMessage.createdAt).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 메시지 내용 */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* 메시지 목록 */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.fromUserEmail === session?.user?.email ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.fromUserEmail === session?.user?.email
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            {message.subject && (
                              <div className="font-semibold text-sm mb-1">{message.subject}</div>
                            )}
                            <div className="text-sm">{message.content}</div>
                            <div className={`text-xs mt-1 ${
                              message.fromUserEmail === session?.user?.email ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {new Date(message.createdAt).toLocaleString('ko-KR')}
                              {!message.isRead && message.fromUserEmail !== session?.user?.email && (
                                <span className="ml-2 bg-red-500 text-white text-xs px-1 rounded">새 메시지</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 메시지 입력 */}
                    <div className="border-t border-gray-200 p-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="메시지를 입력하세요..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={async (e) => {
                            if (e.key === 'Enter' && replyMessage.trim()) {
                              await sendReply();
                            }
                          }}
                        />
                        <button 
                          onClick={sendReply}
                          disabled={!replyMessage.trim()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          전송
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <p>대화를 선택해주세요</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 새 쪽지 작성 모달 */}
        {showCompose && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">새 쪽지 작성</h3>
                <button
                  onClick={() => setShowCompose(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">받는 사람 (이메일)</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">메시지</label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="메시지를 입력하세요..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCompose(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    전송
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </FacebookLayout>
    </>
  );
}