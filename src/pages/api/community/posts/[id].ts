import { NextApiRequest, NextApiResponse } from 'next';

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

// 샘플 댓글 데이터
const sampleComments: Record<string, Comment[]> = {
  '1': [ // BGC 룸메이트 구하는 글
    {
      id: 'c1',
      author: {
        id: 'user_100',
        name: '김지수',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      content: '저도 BGC에서 룸메이트 찾고 있어요! 혹시 아직 구하고 계신가요? 카톡 아이디 알려주시면 연락드릴게요.',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      likes: 2,
      isLiked: false,
      replies: [
        {
          id: 'r1',
          author: {
            id: 'user_1',
            name: 'Maria Santos',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            verified: true
          },
          content: '네! 아직 구하고 있어요. 카톡 아이디는 mariabgc123 입니다 ^^',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          likes: 1,
          isLiked: false
        }
      ]
    },
    {
      id: 'c2',
      author: {
        id: 'user_101',
        name: '박민서',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: '혹시 반려동물은 어떤가요? 저는 작은 강아지를 키우고 있는데 괜찮으신지요?',
      createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      likes: 3,
      isLiked: true,
      replies: []
    }
  ],
  '2': [ // 소프트웨어 개발자 채용공고
    {
      id: 'c3',
      author: {
        id: 'user_102',
        name: '이준호',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      content: '신입도 지원 가능한가요? React는 개인 프로젝트로 경험이 있고 Node.js는 학습 중입니다.',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: 'r2',
          author: {
            id: 'user_2',
            name: 'John Kim',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            verified: true
          },
          content: '네, 신입도 환영합니다! 열정과 학습 의지가 있으시다면 충분합니다. 이력서 보내주시면 검토하겠습니다.',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 3,
          isLiked: true
        }
      ]
    },
    {
      id: 'c4',
      author: {
        id: 'user_103',
        name: '최서연',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: '혹시 파트타임도 가능한가요? 현재 다른 프로젝트를 진행 중이라 풀타임은 어려울 것 같아서요.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 2,
      isLiked: false,
      replies: []
    },
    {
      id: 'c5',
      author: {
        id: 'user_104',
        name: '김태현',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      content: '좋은 기회네요! 지원했습니다. 이메일 확인 부탁드려요.',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      likes: 1,
      isLiked: false,
      replies: []
    }
  ],
  '3': [ // 한인 커뮤니티 바베큐 나이트
    {
      id: 'c6',
      author: {
        id: 'user_105',
        name: '정하은',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      content: '우와 재미있겠네요! 가족 단위로 참가해도 괜찮나요? 아이들이 둘 있어요.',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      isLiked: false,
      replies: [
        {
          id: 'r3',
          author: {
            id: 'user_3',
            name: 'Lisa Chen',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            verified: false
          },
          content: '물론이죠! 가족 단위 대환영입니다. 아이들을 위한 게임도 준비할 예정이에요~',
          createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
          likes: 5,
          isLiked: false
        }
      ]
    },
    {
      id: 'c7',
      author: {
        id: 'user_106',
        name: '박상민',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: '참가비는 있나요? 그리고 주차는 가능한가요?',
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      likes: 4,
      isLiked: true,
      replies: [
        {
          id: 'r4',
          author: {
            id: 'user_3',
            name: 'Lisa Chen',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            verified: false
          },
          content: '참가비는 없어요! 무료입니다. 주차 공간도 충분해요.',
          createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
          likes: 3,
          isLiked: false
        }
      ]
    },
    {
      id: 'c8',
      author: {
        id: 'user_107',
        name: '김영희',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      content: '저도 참가하고 싶어요! 한국 음식 조금 만들어 가도 될까요?',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      likes: 6,
      isLiked: false,
      replies: []
    }
  ],
  '8': [ // 필리핀 5년차의 솔직한 생활 팁 모음
    {
      id: 'c9',
      author: {
        id: 'user_108',
        name: '강민주',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      content: '정말 유용한 정보네요! 특히 에어컨 전기료 절약법 부분이 도움이 많이 됐어요. 혹시 인버터 에어컨 추천해주실 수 있나요?',
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 45,
      isLiked: true,
      replies: [
        {
          id: 'r5',
          author: {
            id: 'user_8',
            name: '이현우',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            verified: true
          },
          content: '저는 LG 듀얼 인버터 사용 중인데 전기료가 확실히 적게 나와요. 삼성도 좋고요. 중요한 건 정기적인 청소예요!',
          createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
          likes: 23,
          isLiked: false
        }
      ]
    },
    {
      id: 'c10',
      author: {
        id: 'user_109',
        name: '윤서준',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: '헬퍼 구하는 방법 좀 더 자세히 알려주실 수 있나요? 신뢰할 수 있는 에이전시가 있을까요?',
      createdAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 32,
      isLiked: false,
      replies: [
        {
          id: 'r6',
          author: {
            id: 'user_8',
            name: '이현우',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            verified: true
          },
          content: '저는 주변 한인분들 추천으로 구했어요. 에이전시보다는 아는 분 소개가 더 안전한 것 같아요. DM 주시면 연락처 드릴게요.',
          createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
          likes: 18,
          isLiked: true
        },
        {
          id: 'r7',
          author: {
            id: 'user_110',
            name: '최지민',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
            verified: false
          },
          content: '저도 헬퍼 정보 부탁드려요! 첫 아이 출산 예정이라 도움이 필요해요.',
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          likes: 12,
          isLiked: false
        }
      ]
    },
    {
      id: 'c11',
      author: {
        id: 'user_111',
        name: '임태영',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      content: '한국 음식 재료 구하기 정보 감사합니다! 혹시 된장이나 고추장 직접 만드시는 분 계신가요?',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 28,
      isLiked: false,
      replies: []
    },
    {
      id: 'c12',
      author: {
        id: 'user_112',
        name: '송미라',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: '병원 추천 부분 정말 도움됐어요! St. Luke\'s 가격이 비싸긴 하지만 서비스는 정말 좋더라구요.',
      createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 35,
      isLiked: true,
      replies: []
    }
  ],
  '14': [ // 필리핀 이주 전 꼭 알아야 할 100가지
    {
      id: 'c13',
      author: {
        id: 'user_113',
        name: '한동훈',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      content: '이 글은 정말 바이블이네요! 이주 준비하면서 10번은 읽은 것 같아요. 덕분에 잘 정착했습니다. 감사합니다!',
      createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 234,
      isLiked: true,
      replies: [
        {
          id: 'r8',
          author: {
            id: 'user_14',
            name: '박성민',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            verified: true
          },
          content: '도움이 되셨다니 정말 기쁘네요! 필리핀 생활 화이팅입니다!',
          createdAt: new Date(Date.now() - 299 * 24 * 60 * 60 * 1000).toISOString(),
          likes: 89,
          isLiked: false
        }
      ]
    },
    {
      id: 'c14',
      author: {
        id: 'user_114',
        name: '김나연',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: '비자 관련 정보 업데이트가 필요한 것 같아요. 최근에 규정이 좀 바뀌었더라구요.',
      createdAt: new Date(Date.now() - 280 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 156,
      isLiked: false,
      replies: [
        {
          id: 'r9',
          author: {
            id: 'user_14',
            name: '박성민',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            verified: true
          },
          content: '맞아요! 곧 업데이트 버전 올릴 예정입니다. 피드백 감사해요!',
          createdAt: new Date(Date.now() - 279 * 24 * 60 * 60 * 1000).toISOString(),
          likes: 67,
          isLiked: true
        }
      ]
    },
    {
      id: 'c15',
      author: {
        id: 'user_115',
        name: '정수빈',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      content: '초등학생 자녀 교육 관련해서 추가 정보 있으면 좋겠어요. 국제학교 vs 한국학교 고민이 많네요.',
      createdAt: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 198,
      isLiked: false,
      replies: []
    }
  ]
};

// 모든 게시글에 대한 기본 댓글 (댓글이 없는 경우)
const defaultComments: Comment[] = [
  {
    id: 'default1',
    author: {
      id: 'user_200',
      name: '김민수',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: false
    },
    content: '좋은 정보 감사합니다!',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 1,
    isLiked: false,
    replies: []
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // API에서 게시글 목록을 가져옴
    const postsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005'}/api/community/posts`);
    const postsData = await postsResponse.json();
    
    const post = postsData.data.find((p: any) => p.id === id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // 해당 게시글의 댓글 가져오기
    const comments = sampleComments[id as string] || defaultComments;

    res.status(200).json({
      success: true,
      data: {
        post: {
          ...post,
          views: post.views + 1 // 조회수 증가
        },
        comments
      }
    });
  } catch (error) {
    console.error('Error fetching post detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}