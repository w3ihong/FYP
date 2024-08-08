'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import ModalContainer from "@/components/modalContainer";
import ModalRemoveConfirmation from "@/components/modalRemoveConfirmation";
import FacebookSDK from './facebook/facebookSDK';
import { instagramOAuth } from "../auth/socials/instagram";
import ModalPostDetail from "@/components/ModalPostDetails";
import { getPosts, fetchUserName, getAccounts } from "../actions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import DatePicker, { DateRangeType } from 'react-tailwindcss-datepicker';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
    testAPI: () => void;
  }
}

interface Post {
  id: string;
  created_at: string;
  post_type: string;
  platform_account: string;
  caption: string;
  media_url: string;
  permalink: string;
  video_thumbnail: string;
  platform: string;
}

export default function Index() {
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [disconnectAccountIndex, setDisconnectAccountIndex] = useState<number | null>(null);
  const [isConnectSocialModalOpen, setConnectSocialModalOpen] = useState(false);
  const [userName, setUserName] = useState<{ user_id: string; first_name: string; last_name: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRangeType>({ startDate: null, endDate: null });
  const [accounts, setAccounts] = useState<{ id: number; account_username: string }[]>([]); // the social accounts name

  useEffect(() => {
    const initialize = async () => {
      try {
        // Fetch user data
        const userData = await fetchUserName();
        if (userData) {
          setUserName(userData);

          // Fetch accounts for the user
          const accountsData = await getAccounts(userData.user_id);
          setAccounts(accountsData);
        }

        const postsData = await getPosts();
        if (postsData.length > 0) {
          setPosts(postsData);
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    initialize();
  }, []);

  const handleFBLogin = () => {
    if (window.FB) {
      window.FB.login((response: any) => {
        if (response.authResponse) {
          console.log('Welcome! Fetching your information.... ');
          window.testAPI();
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, { scope: 'public_profile,email' });
    } else {
      console.log('Facebook SDK not loaded yet.');
    }
  };

  const handleLoginSuccess = (response: any) => {
    setUserName(response.name);
    setLoggedIn(true);
  };

  const handleDisconnectAccount = () => {
    if (disconnectAccountIndex !== null) {
      console.log("Disconnecting account:", disconnectAccountIndex + 1);
      setDisconnectAccountIndex(null);
      setAccountModalOpen(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.5, ease: "easeInOut" } }
  };

  const filteredPosts = posts
    .filter(post => platformFilter === "all" || post.platform === platformFilter)
    .filter(post => {
      const postDate = new Date(post.created_at);
      if (!dateRange.startDate && !dateRange.endDate) return true;
      if (dateRange.startDate && postDate < new Date(dateRange.startDate)) return false;
      if (dateRange.endDate && postDate > new Date(dateRange.endDate)) return false;
      return true;
    });

  // Custom Dropdown Component
  const CustomDropdown = ({ value, onChange }) => {
    const options = [
      { value: 'all', label: 'All', icon: null },
      { value: 'Instagram', label: 'Instagram', icon: faInstagram },
    ];

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [dropdownRef]);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className="bg-white text-accent px-3 py-1 w-40 rounded-md border border-0 shadow p-2 rounded transition-transform duration-200 transform hover:-translate-y-1 flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            {options.find(option => option.value === value)?.label}
          </span>
          <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md z-10">
            {options.map(option => (
              <div
                key={option.value}
                className="cursor-pointer px-4 py-2 hover:bg-gray-200 flex items-center"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.icon && (
                  <FontAwesomeIcon icon={option.icon} className="mr-2" />
                )}
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex">
      <FacebookSDK onLoginSuccess={handleLoginSuccess} />
      <div className="flex-1 ml-1">
        <motion.div
          className="p-6 -mt-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <h1 className="text-2xl font-bold text-accent">Welcome Back, {userName ? `${userName.first_name} ${userName.last_name}` : ''}!</h1>
          <p className="text-sm text-gray-600">Feel free to explore around</p>
          <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-bold text-accent">Account Overview</h2>
          </div>
          <div className="flex flex-row gap-6 mt-4">
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-accent">Social Accounts</h3>
                <button
                  className="bg-white text-accent px-3 py-1 rounded-md border border-accent"
                  onClick={() => setAccountModalOpen(true)}
                >
                  Manage Accounts
                </button>
              </div>
              <p className="text-sm text-gray-600">Recently Added</p>
              <div className="overflow-y-auto max-h-[400px] mt-3 space-y-3 pb-2">
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <div key={account.id} className="bg-white rounded-md shadow-md p-3 mb-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-bold">{account.account_username}</div>
                        <button
                          className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700"
                          onClick={() => setDisconnectAccountIndex(account.id)}
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No accounts connected. Connect to social media to see your accounts.</p>
                )}
              </div>
            </div>
          </div>

          {/* Posts Feed Section */}
          <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-accent">Your Posts</h2>
              <div className="flex gap-4">
                <DatePicker
                  value={dateRange}
                  onChange={(range) => setDateRange(range)}
                  displayFormat="MM/DD/YYYY"
                  placeholder="Date Filter"
                  useRange={false}
                />
                <CustomDropdown
                  value={platformFilter}
                  onChange={setPlatformFilter}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3 max-h-[800px] overflow-y-auto">
              {loggedIn ? (
                filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-md shadow-md p-3 cursor-pointer transform transition duration-300 ease-in-out hover:scale-105" onClick={() => setSelectedPost(post)}>
                      <div className="aspect-square overflow-hidden">
                        {post.post_type === 'VIDEO' ? (
                          <img src={post.video_thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No posts to display. Connect to Instagram to see your posts.</p>
                )
              ) : (
                <p>Not logged-in to any account. Connect to your social media to start!</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Status element */}
      <div id="status" className="hidden"></div>

      {/* Manage Account Modal */}
      <ModalContainer isOpen={isAccountModalOpen} onClose={() => setAccountModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-2 mt-8">Manage Your Accounts</h2>
        <div className="mb-6">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
            placeholder="Search accounts..."
          />
        </div>

        <div className="space-y-4 max-h-[320px] overflow-y-auto pb-4">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <div key={account.id} className="bg-white rounded-md shadow-md p-3 mb-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold">{account.account_username}</div>
                  <button
                    className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700"
                    onClick={() => setDisconnectAccountIndex(account.id)}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No accounts connected. Connect to social media to see your accounts.</p>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-blue-900"
            onClick={() => setConnectSocialModalOpen(true)}
          >
            Connect To More Social Media Accounts
          </button>
        </div>
      </ModalContainer>

      <ModalRemoveConfirmation
        isOpen={disconnectAccountIndex !== null}
        onClose={() => setDisconnectAccountIndex(null)}
        message="Are you sure you want to disconnect this social media account?"
        onConfirm={handleDisconnectAccount}
      />

      {/* Modal for Connect Social Media Account */}
      <ModalContainer isOpen={isConnectSocialModalOpen} onClose={() => setConnectSocialModalOpen(false)}>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <h2 className="text-2xl font-bold mb-2">Connect To More Social Media Accounts</h2>
          <button
            onClick={instagramOAuth}
            className="w-80 px-2 py-2 bg-accent text-white text-base font-medium rounded-md shadow-sm flex items-center justify-center hover:bg-blue-900">
            <img src="/Instagram.png" alt="Instagram" className="w-6 h-6 mr-2" /> Instagram
          </button>

          <button
            onClick={handleFBLogin}
            className="w-80 px-2 py-2 bg-accent text-white text-base font-medium rounded-md shadow-sm flex items-center justify-center hover:bg-blue-900"
          >
            <img src="/Facebook.png" alt="Facebook" className="w-6 h-6 mr-2" /> Facebook
          </button>
        </div>
      </ModalContainer>

      {/* Modal for Post Details */}
      <ModalPostDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
