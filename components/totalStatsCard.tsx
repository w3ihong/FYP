import React from 'react';

interface TotalStatsCardProps {
  followers: number;
  likes: number;
  shares: number;
  comments: number;
  saved: number;
}

const TotalStatsCard: React.FC<TotalStatsCardProps> = ({
  followers,
  likes,
  shares,
  comments,
  saved,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-center">
      <div className="grid grid-cols-6 gap-4 w-full max-w-screen-lg">
        <div className="col-span-1 text-center">
          <p className="text-sm font-medium text-gray-600 font-raleway">Followers</p>
          <p className="text-lg font-bold">{followers}</p>
        </div>
        <div className="col-span-1 text-center">
          <p className="text-sm font-medium text-gray-600 font-raleway">Likes</p>
          <p className="text-lg font-bold">{likes}</p>
        </div>
        <div className="col-span-1 text-center">
          <p className="text-sm font-medium text-gray-600 font-raleway">Shares</p>
          <p className="text-lg font-bold">{shares}</p>
        </div>
        <div className="col-span-1 text-center">
          <p className="text-sm font-medium text-gray-600 font-raleway">Comments</p>
          <p className="text-lg font-bold">{comments}</p>
        </div>
        <div className="col-span-1 text-center">
          <p className="text-sm font-medium text-gray-600 font-raleway">Saves</p>
          <p className="text-lg font-bold">{saved}</p>
        </div>
      </div>
    </div>
  );
};

export default TotalStatsCard;