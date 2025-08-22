import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
  unread?: number;
  online?: boolean;
  verified?: boolean;
  type: 'personal' | 'group' | 'channel';
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
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [username, setUsername] = useState('');
  const [currentUser] = useState<User>({
    id: '1',
    username: 'yura_dev',
    name: 'Юра',
    verified: true,
    online: true
  });

  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Анна Смирнова',
      lastMessage: 'Привет! Как дела?',
      time: '14:32',
      unread: 2,
      online: true,
      verified: false,
      type: 'personal'
    },
    {
      id: '2', 
      name: 'Команда разработки',
      lastMessage: 'Михаил: Новая версия готова к тестированию',
      time: '13:45',
      unread: 5,
      type: 'group'
    },
    {
      id: '3',
      name: 'Новости Tech',
      lastMessage: 'Обновление React 19 уже доступно!',
      time: '12:20',
      verified: true,
      type: 'channel'
    },
    {
      id: '4',
      name: 'Дмитрий Петров',
      lastMessage: 'Спасибо за помощь вчера! 👍',
      time: '11:15',
      online: false,
      verified: true,
      type: 'personal'
    }
  ]);

  const [messages] = useState([
    { id: '1', text: 'Привет! Как дела?', sender: 'other', time: '14:30' },
    { id: '2', text: 'Привет! Всё отлично, работаю над новым проектом', sender: 'me', time: '14:31' },
    { id: '3', text: 'Звучит интересно! Расскажешь подробнее?', sender: 'other', time: '14:32' }
  ]);

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUsernameCheck = () => {
    if (username === 'admin' || username === 'support') {
      alert('Этот юзернейм уже занят. Попробуйте другой.');
      return;
    }
    alert(`Юзернейм @${username} свободен! Регистрация завершена.`);
    setShowRegistration(false);
    setUsername('');
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-telegram-dark-gray">Untitled</h1>
            <div className="flex items-center gap-2">
              <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-telegram-blue hover:bg-blue-50">
                    <Icon name="Plus" size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Создать</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Button className="w-full justify-start bg-telegram-blue hover:bg-blue-600" onClick={() => setShowCreateGroup(false)}>
                      <Icon name="Users" size={16} className="mr-2" />
                      Новая группа
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setShowCreateGroup(false)}>
                      <Icon name="Radio" size={16} className="mr-2" />
                      Новый канал
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-telegram-blue hover:bg-blue-50">
                    <Icon name="UserPlus" size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Регистрация</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-telegram-dark-gray">Выберите юзернейм</label>
                      <Input
                        placeholder="@username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace('@', ''))}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleUsernameCheck} className="w-full bg-telegram-blue hover:bg-blue-600">
                      Проверить доступность
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="bg-telegram-blue text-white font-medium">
                        {chat.name.split(' ').map(n => n[0]).join('')}
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
                      {chat.lastMessage}
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
                  {currentUser.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-telegram-online rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-medium text-telegram-dark-gray text-sm">
                  {currentUser.name}
                </span>
                {currentUser.verified && (
                  <Icon name="CheckCircle" size={12} className="text-telegram-blue" />
                )}
              </div>
              <span className="text-xs text-telegram-light-gray">@{currentUser.username}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-telegram-light-gray hover:bg-gray-50">
              <Icon name="Settings" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-telegram-blue text-white font-medium text-sm">
                      АС
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-telegram-dark-gray">Анна Смирнова</span>
                    </div>
                    <span className="text-sm text-telegram-online">онлайн</span>
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
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'me'
                          ? 'bg-telegram-blue text-white'
                          : 'bg-gray-100 text-telegram-dark-gray'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'me' ? 'text-blue-100' : 'text-telegram-light-gray'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="text-telegram-light-gray hover:bg-gray-50">
                  <Icon name="Paperclip" size={18} />
                </Button>
                <div className="flex-1">
                  <Input
                    placeholder="Написать сообщение..."
                    className="border-none bg-gray-50 focus:bg-gray-100"
                  />
                </div>
                <Button variant="ghost" size="sm" className="text-telegram-light-gray hover:bg-gray-50">
                  <Icon name="Smile" size={18} />
                </Button>
                <Button size="sm" className="bg-telegram-blue hover:bg-blue-600">
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