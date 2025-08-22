import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'ai' | 'other';
  time: string;
  username?: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
  unread?: number;
  online?: boolean;
  verified?: boolean;
  type: 'personal' | 'group' | 'channel' | 'ai';
  messages: Message[];
}

interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  verified?: boolean;
  online?: boolean;
}

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<'phone' | 'code' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [usernameError, setUsernameError] = useState('');
  
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const initializeChats = (user: User) => {
    const aiChat: Chat = {
      id: 'ai-assistant',
      name: 'ИИ Помощник',
      lastMessage: 'Привет! Я готов помочь тебе с любыми вопросами!',
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      online: true,
      verified: true,
      type: 'ai',
      messages: [
        {
          id: '1',
          text: `Привет, ${user.name}! 👋 Я твой личный ИИ-помощник. Могу помочь с вопросами, задачами, или просто поболтать. Чем займёмся?`,
          sender: 'ai',
          time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    const sampleChats: Chat[] = [
      {
        id: '1',
        name: 'Анна Смирнова',
        lastMessage: 'Привет! Как дела с проектом?',
        time: '14:32',
        unread: 2,
        online: true,
        verified: false,
        type: 'personal',
        messages: [
          { id: '1', text: 'Привет! Как дела с проектом?', sender: 'other', time: '14:30', username: 'anna_dev' },
          { id: '2', text: 'Привет! Всё идёт по плану, скоро покажу результат', sender: 'me', time: '14:31' }
        ]
      },
      {
        id: '2',
        name: 'Команда разработки',
        lastMessage: 'Михаил: Встреча в 16:00',
        time: '13:45',
        unread: 3,
        type: 'group',
        messages: [
          { id: '1', text: 'Всем привет! Сегодня встреча в 16:00', sender: 'other', time: '13:44', username: 'mikhail_pm' },
          { id: '2', text: 'Буду!', sender: 'me', time: '13:45' }
        ]
      }
    ];

    setChats([aiChat, ...sampleChats]);
    setSelectedChat('ai-assistant');
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.length < 10) {
      alert('Введите корректный номер телефона');
      return;
    }
    setRegistrationStep('code');
  };

  const handleCodeSubmit = () => {
    if (verificationCode !== '1234') {
      alert('Неверный код. Попробуйте 1234');
      return;
    }
    setRegistrationStep('profile');
  };

  const checkUsername = async (username: string) => {
    const forbiddenUsernames = ['admin', 'support', 'bot', 'api', 'help', 'news'];
    if (forbiddenUsernames.includes(username.toLowerCase())) {
      return false;
    }
    return true;
  };

  const handleProfileSubmit = async () => {
    if (!username || !fullName) {
      alert('Заполните все поля');
      return;
    }

    const isUsernameAvailable = await checkUsername(username);
    if (!isUsernameAvailable) {
      setUsernameError('Этот юзернейм уже занят');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      username,
      name: fullName,
      verified: Math.random() > 0.7,
      online: true
    };

    setCurrentUser(user);
    initializeChats(user);
    setIsAuthenticated(true);
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    setIsTyping(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      `Интересный вопрос! ${userMessage.toLowerCase().includes('как') ? 'Вот несколько способов решения...' : 'Давай разберёмся вместе.'}`,
      `Понятно! Касательно "${userMessage}", могу сказать следующее...`,
      `Отличная мысль! Это напоминает мне о том, что...`,
      `Хороший вопрос про "${userMessage.slice(0, 30)}...". По моему мнению...`,
      `Ого, интересно! Давай подумаем над этим вместе.`,
      `Это важная тема. Вот что я думаю по этому поводу...`,
      `Круто, что ты спрашиваешь об этом! Моё мнение такое...`
    ];

    if (userMessage.toLowerCase().includes('привет') || userMessage.toLowerCase().includes('здравствуй')) {
      return 'Привет! 😊 Рад тебя видеть! Как дела? Чем могу помочь?';
    }

    if (userMessage.toLowerCase().includes('как дела')) {
      return 'У меня всё отлично! Готов помочь с любыми задачами. А у тебя как дела?';
    }

    if (userMessage.toLowerCase().includes('спасибо')) {
      return 'Всегда пожалуйста! Рад был помочь. Есть ещё вопросы? 😊';
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messageTime = new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      time: messageTime
    };

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChat 
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              lastMessage: newMessage,
              time: messageTime
            }
          : chat
      )
    );

    const messageCopy = newMessage;
    setNewMessage('');

    if (selectedChat === 'ai-assistant') {
      const aiResponse = await generateAIResponse(messageCopy);
      setIsTyping(false);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === selectedChat 
            ? {
                ...chat,
                messages: [...chat.messages, aiMessage],
                lastMessage: aiResponse,
                time: aiMessage.time
              }
            : chat
        )
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-telegram-blue to-blue-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-telegram-blue" />
              <h1 className="text-2xl font-bold text-telegram-dark-gray mb-2">Untitled</h1>
              <p className="text-telegram-light-gray">Современный мессенджер</p>
            </div>

            {registrationStep === 'phone' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-telegram-dark-gray mb-2 block">
                    Номер телефона
                  </label>
                  <Input
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-center"
                  />
                </div>
                <Button 
                  onClick={handlePhoneSubmit}
                  className="w-full bg-telegram-blue hover:bg-blue-600"
                  size="lg"
                >
                  Получить код
                </Button>
              </div>
            )}

            {registrationStep === 'code' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-telegram-dark-gray mb-2 block">
                    Код подтверждения
                  </label>
                  <p className="text-xs text-telegram-light-gray mb-3">
                    Отправлен на {phoneNumber} (попробуйте 1234)
                  </p>
                  <Input
                    type="text"
                    placeholder="1234"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="text-center text-lg tracking-widest"
                    maxLength={4}
                  />
                </div>
                <Button 
                  onClick={handleCodeSubmit}
                  className="w-full bg-telegram-blue hover:bg-blue-600"
                  size="lg"
                >
                  Подтвердить
                </Button>
              </div>
            )}

            {registrationStep === 'profile' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-telegram-dark-gray mb-2 block">
                    Имя и фамилия
                  </label>
                  <Input
                    placeholder="Иван Иванов"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-telegram-dark-gray mb-2 block">
                    Юзернейм
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-telegram-light-gray">@</span>
                    <Input
                      placeholder="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                        setUsernameError('');
                      }}
                      className="pl-8"
                    />
                  </div>
                  {usernameError && (
                    <p className="text-xs text-red-500 mt-1">{usernameError}</p>
                  )}
                </div>
                <Button 
                  onClick={handleProfileSubmit}
                  className="w-full bg-telegram-blue hover:bg-blue-600"
                  size="lg"
                >
                  Завершить регистрацию
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-telegram-dark-gray">Untitled</h1>
            <Button variant="ghost" size="sm" className="text-telegram-blue hover:bg-blue-50">
              <Icon name="Plus" size={20} />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-telegram-light-gray" />
            <Input
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 p-1 m-4 mb-0">
            <TabsTrigger value="chats" className="text-xs">Чаты</TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs">Контакты</TabsTrigger>
            <TabsTrigger value="calls" className="text-xs">Звонки</TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="flex-1 m-0">
            <ScrollArea className="flex-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedChat === chat.id ? 'bg-blue-50 border-r-2 border-telegram-blue' : ''
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={`${chat.type === 'ai' ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-telegram-blue'} text-white font-medium`}>
                        {chat.type === 'ai' ? '🤖' : chat.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-telegram-online rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-medium text-telegram-dark-gray truncate">
                        {chat.name}
                      </span>
                      {chat.verified && (
                        <Icon name="CheckCircle" size={14} className="text-telegram-blue flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-telegram-light-gray truncate">
                      {isTyping && selectedChat === chat.id && chat.type === 'ai' 
                        ? 'печатает...' 
                        : chat.lastMessage
                      }
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-telegram-light-gray">{chat.time}</span>
                    {chat.unread && (
                      <Badge className="bg-telegram-blue hover:bg-telegram-blue text-xs px-2">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="contacts" className="flex-1 m-0 p-4">
            <div className="text-center text-telegram-light-gray">
              <Icon name="Users" size={48} className="mx-auto mb-3 opacity-50" />
              <p>Добавьте контакты по @юзернейму</p>
              <Button variant="outline" className="mt-3 text-telegram-blue border-telegram-blue">
                <Icon name="UserPlus" size={16} className="mr-2" />
                Добавить контакт
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="calls" className="flex-1 m-0 p-4">
            <div className="text-center text-telegram-light-gray">
              <Icon name="Phone" size={48} className="mx-auto mb-3 opacity-50" />
              <p>История звонков пуста</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-telegram-blue text-white font-medium text-sm">
                  {currentUser?.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-telegram-online rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-medium text-telegram-dark-gray text-sm">
                  {currentUser?.name}
                </span>
                {currentUser?.verified && (
                  <Icon name="CheckCircle" size={12} className="text-telegram-blue" />
                )}
              </div>
              <span className="text-xs text-telegram-light-gray">@{currentUser?.username}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-telegram-light-gray hover:bg-gray-50">
              <Icon name="Settings" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${selectedChatData.type === 'ai' ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-telegram-blue'} text-white font-medium text-sm`}>
                      {selectedChatData.type === 'ai' ? '🤖' : selectedChatData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-telegram-dark-gray">{selectedChatData.name}</span>
                      {selectedChatData.verified && (
                        <Icon name="CheckCircle" size={14} className="text-telegram-blue" />
                      )}
                    </div>
                    <span className="text-sm text-telegram-online">
                      {isTyping && selectedChatData.type === 'ai' ? 'печатает...' : selectedChatData.online ? 'онлайн' : 'был в сети недавно'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-telegram-light-gray hover:bg-gray-50">
                    <Icon name="Phone" size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-telegram-light-gray hover:bg-gray-50">
                    <Icon name="Video" size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-telegram-light-gray hover:bg-gray-50">
                    <Icon name="MoreVertical" size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedChatData.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-xs lg:max-w-md">
                      {message.sender !== 'me' && (
                        <Avatar className="h-8 w-8 mb-1">
                          <AvatarFallback className={`${message.sender === 'ai' ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-telegram-blue'} text-white text-xs`}>
                            {message.sender === 'ai' ? '🤖' : (selectedChatData.name[0])}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.sender === 'me'
                            ? 'bg-telegram-blue text-white rounded-br-md'
                            : message.sender === 'ai'
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-bl-md'
                            : 'bg-gray-100 text-telegram-dark-gray rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'me' 
                            ? 'text-blue-100' 
                            : message.sender === 'ai'
                            ? 'text-purple-100'
                            : 'text-telegram-light-gray'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end gap-3">
                <Button variant="ghost" size="sm" className="text-telegram-light-gray hover:bg-gray-50 mb-2">
                  <Icon name="Paperclip" size={18} />
                </Button>
                <div className="flex-1">
                  <Textarea
                    placeholder="Написать сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[40px] max-h-[120px] resize-none border-none bg-gray-50 focus:bg-gray-100"
                    rows={1}
                  />
                </div>
                <Button variant="ghost" size="sm" className="text-telegram-light-gray hover:bg-gray-50 mb-2">
                  <Icon name="Smile" size={18} />
                </Button>
                <Button 
                  size="sm" 
                  className="bg-telegram-blue hover:bg-blue-600 mb-2"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Icon name="Send" size={16} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Icon name="MessageCircle" size={64} className="mx-auto mb-4 text-telegram-light-gray opacity-50" />
              <h2 className="text-xl font-medium text-telegram-dark-gray mb-2">Добро пожаловать в Untitled</h2>
              <p className="text-telegram-light-gray">Выберите чат, чтобы начать общение</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}