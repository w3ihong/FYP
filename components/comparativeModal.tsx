import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faThumbsUp, faShare, faEye, faSave, faUserFriends } from '@fortawesome/free-solid-svg-icons';

interface Post {
  id: string;
  created_at: string;
  post_type: string;
  platform_account: string;
  caption: string;
  media_url: string;
  permalink: string;
  video_thumbnail: string;
  metrics: {
    post_comments: number;
    post_likes: number;
    post_shares: number;
    post_impressions: number;
    post_saved: number;
    post_reach: number;
  };
}

interface ComparisonModalProps {
  posts: Post[];
  isOpen: boolean;
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ posts, isOpen, onClose }) => {
  if (!isOpen || posts.length !== 2) return null;

  const [post1, post2] = posts;

  const calculateDifference = (metric1: number, metric2: number) => {
    const difference = metric2 - metric1;
    const colorClass = difference >= 0 ? 'text-green-500' : 'text-red-500';
    return <span className={colorClass}>{`(${difference >= 0 ? '+' : ''}${difference})`}</span>;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto transition-opacity duration-300">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-full overflow-y-auto shadow-lg transform transition-transform duration-300 scale-95">
        <h2 className="text-xl font-bold text-accent mb-4">Comparative Analysis</h2>
        <div className="grid grid-cols-2 gap-4">
          {[post1, post2].map((post, index) => (
            <div key={post.id} className="bg-gray-100 w-200 rounded-md shadow-md p-4 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-s font-semibold text-accent mb-2">{post.caption}</h3>
              <p className="text-sm text-gray-500 mb-4">{post.created_at}</p>
              {post.post_type === 'VIDEO' ? (
                <img src={post.video_thumbnail} alt="" className="w-70 h-70 object-cover rounded-md mb-4" />
              ) : (
                <img src={post.media_url} alt="" className="w-70 h-70 object-cover rounded-md mb-4" />
              )}
              <div className="space-y-2">
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faComments} className="mr-2 text-gray-600" />
                  Comments: {post.metrics.post_comments || 0} {index === 0 ? calculateDifference(post2.metrics.post_comments, post1.metrics.post_comments) : calculateDifference(post1.metrics.post_comments, post2.metrics.post_comments)}
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faThumbsUp} className="mr-2 text-gray-600" />
                  Likes: {post.metrics.post_likes || 0} {index === 0 ? calculateDifference(post2.metrics.post_likes, post1.metrics.post_likes) : calculateDifference(post1.metrics.post_likes, post2.metrics.post_likes)}
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faShare} className="mr-2 text-gray-600" />
                  Shares: {post.metrics.post_shares || 0} {index === 0 ? calculateDifference(post2.metrics.post_shares, post1.metrics.post_shares) : calculateDifference(post1.metrics.post_shares, post2.metrics.post_shares)}
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faEye} className="mr-2 text-gray-600" />
                  Post Impressions: {post.metrics.post_impressions || 0} {index === 0 ? calculateDifference(post2.metrics.post_impressions, post1.metrics.post_impressions) : calculateDifference(post1.metrics.post_impressions, post2.metrics.post_impressions)}
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faSave} className="mr-2 text-gray-600" />
                  Post Saved: {post.metrics.post_saved || 0} {index === 0 ? calculateDifference(post2.metrics.post_saved, post1.metrics.post_saved) : calculateDifference(post1.metrics.post_saved, post2.metrics.post_saved)}
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faUserFriends} className="mr-2 text-gray-600" />
                  Post Reach: {post.metrics.post_reach || 0} {index === 0 ? calculateDifference(post2.metrics.post_reach, post1.metrics.post_reach) : calculateDifference(post1.metrics.post_reach, post2.metrics.post_reach)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-accent text-white rounded-lg hover:bg-cyan-900 transition-colors duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ComparisonModal;
