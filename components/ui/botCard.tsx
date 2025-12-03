import { Message } from 'ai';
import ReactMarkdown from 'react-markdown';
import { PiCoffeeFill } from "react-icons/pi";
import { MdImageSearch, MdWeb } from "react-icons/md";
import Image from 'next/image';
import { ComponentOutput } from '@/app/design/designAgent';
import { GeneratedComponent } from './generatedComponent';

export interface ComponentInChatHistory {
  id: string;
  chatId: string;
  html: string;
  css: string;
  stylingNotes: string;
  colorDetails: { hex: string, usage: string }[];
}

export const BotCard = ({
  message,
}: {
  message: Message & {
    parts?: any[];
    experimental_attachments?: {
      contentType?: string;
      url: string;
      name?: string;
    }[];
  };
  componentOutput?: ComponentInChatHistory;
  onCopyToClipboard?: (clipboardData: string) => void;
}) => {

  const LinkRenderer = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
      <a className='text-blue-500 font-bold underline' href={props.href} target="_blank" rel="noreferrer">
        {props.children}
      </a>
    );
  }

  const ImageRenderer = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img {...props} className={`w-full max-h-[400px] md:max-h-[500px] object-contain cursor-pointer hover:outline hover:outline-2 hover:outline-black ${props.className ?? ''}`} onClick={() => props.src && window.open(props.src, '_blank')} />
    );
  }

  const renderGeneratedComponent = () => {
    return null;
  }

  return (
    <div className='bg-gray-200/90 rounded-md p-4 border border-gray-300 overflow-x-auto'>
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full mr-2 flex items-center justify-center">
          <Image src='/avatar.png' alt='logo' width={32} height={32} priority />
        </div>
        <div className="font-bold">AI</div>
      </div>

      {/* Display all message parts */}
      {renderGeneratedComponent()}

      <ReactMarkdown
        className="font-afacad"
        components={{ a: LinkRenderer, img: ImageRenderer }}
      >
        {message.content}
      </ReactMarkdown>

      {/* Tool invocation messages */}
      {!!message?.parts?.length && message.parts.some((part: any) => part.type === 'tool-invocation' && part.toolInvocation.state !== 'result' && part.toolInvocation.toolName === 'searchFigmaDocs') && 
        <div className='flex items-center space-x-2'>
          <span className="italic font-light font-afacad text-lg">Let me get back to you with the answer while I drink my coffee and read the documentation of Figma...</span>
          <PiCoffeeFill size={16} />
        </div>
      }
      {!!message?.parts?.length && message.parts.some((part: any) => part.type === 'tool-invocation' && part.toolInvocation.state !== 'result' && part.toolInvocation.toolName === 'createWebComponent') && 
        <div className='flex items-center space-x-2'>
          <span className="italic font-light font-afacad text-lg">Let me create the web component for you...</span>
          <MdWeb size={16} />
        </div>
      }

      {/* Attachments */}
      <Attachments attachments={message.experimental_attachments} messageId={message.id} />
    </div>
  );
};

interface AttachmentsProps {
  attachments?: {
    contentType?: string;
    url: string;
    name?: string;
  }[];
  messageId: string;
}

export const Attachments: React.FC<AttachmentsProps> = ({ attachments, messageId }) => {
  if (!attachments || attachments.length === 0) return null;
  
  return (
    <div className='flex flex-wrap gap-4 mt-4'>
      {attachments.map((attachment, index) => {
        if (attachment.contentType?.startsWith('image/')) {
          return (
            <div key={`${messageId}-${index}`} className='w-full max-w-md aspect-square bg-gray-200 flex items-center justify-center'>
              <Image
                src={attachment.url}
                width={500}
                height={500}
                alt={attachment.name ?? `attachment-${index}`}
                className='object-contain'
              />
              {attachment.name && (
                <div className='mt-2 text-center text-sm text-gray-700'>{attachment.name}</div>
              )}
            </div>
          );
        } else {
          return (
            <div key={`${messageId}-${index}`} className='w-[500px] h-[500px] bg-gray-200 flex items-center justify-center'>
              {attachment.name}
            </div>
          );
        }
      })}
    </div>
  );
};