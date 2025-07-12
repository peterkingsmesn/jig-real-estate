import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

interface SendMessageButtonProps {
  recipientEmail: string;
  recipientName: string;
  className?: string;
}

const SendMessageButton: React.FC<SendMessageButtonProps> = ({
  recipientEmail,
  recipientName,
  className = ''
}) => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ subject: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendMessage = async () => {
    if (!message.content.trim()) {
      alert('메시지 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toEmail: recipientEmail,
          subject: message.subject || `${recipientName}님께 보내는 메시지`,
          content: message.content
        }),
      });

      if (response.ok) {
        alert('메시지가 전송되었습니다.');
        setMessage({ subject: '', content: '' });
        setShowModal(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error?.message || '메시지 전송 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('메시지 전송 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로그인하지 않았거나 자기 자신인 경우 버튼을 표시하지 않음
  if (!session || session.user?.email === recipientEmail) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${className}`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        <span>쪽지 보내기</span>
      </button>

      {/* 쪽지 작성 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                {recipientName}님께 쪽지 보내기
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">받는 사람</label>
                <input
                  type="text"
                  value={`${recipientName} (${recipientEmail})`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  value={message.subject}
                  onChange={(e) => setMessage(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="제목을 입력하세요 (선택사항)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">메시지 *</label>
                <textarea
                  value={message.content}
                  onChange={(e) => setMessage(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="메시지를 입력하세요..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? '전송 중...' : '전송'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SendMessageButton;