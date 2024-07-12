import React from 'react';
import ModalBackdrop from './modalBackdrop';

const ModalPostDetail: React.FC<{ post: any, onClose: () => void }> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white w-[32rem] h-auto opacity-100 p-6" onClick={(e) => e.stopPropagation()}>
        <p className="mb-4">{post.created_at}</p>
        {post.post_type === 'IMAGE' ? (
          <img src={post.media_url} alt={post.title} className="mb-4 w-80 h-80 object-cover" />
        ) : post.post_type === 'VIDEO' ? (
          <video controls className="mb-4 w-80 h-80 object-cover">
            <source src={post.media_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null}
        <h2 className="text-xs font-bold mb-4">{post.caption}</h2>
        <button className="bg-accent w-24 h-8 text-white" onClick={onClose}>Close</button>
      </div>
    </ModalBackdrop>
  );
};

export default ModalPostDetail;
