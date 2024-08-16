'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import ModalContainer from "@/components/modalContainer";
import ModalRemoveConfirmation from "@/components/modalRemoveConfirmation";
import { instagramOAuth } from "../auth/socials/instagram";
import { getAccountMetrics, fetchUserName, getAccounts } from "../actions";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import TotalStatsCard from "@/components/totalStatsCard";
import LineChart from "@/components/lineChart";



export default function Index() {
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [disconnectAccountIndex, setDisconnectAccountIndex] = useState<number | null>(null);
  const [isConnectSocialModalOpen, setConnectSocialModalOpen] = useState(false);
  const [userName, setUserName] = useState<{ user_id: string; first_name: string; last_name: string } | null>(null);
  const [hasAccount, setHasAccount] = useState(false);
  const [accounts, setAccounts] = useState<{ id: number; account_username: string ; platform: string; picture_url: string}[]>([]); // the social accounts name
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [accountMetrics, setAccountMetrics] = useState<any[]>([]); 

  const totalStats = accountMetrics.length > 0 ? accountMetrics[accountMetrics.length - 1] : {};
  const { platform_followers = 0, platform_likes = 0, platform_comments = 0, platform_saves = 0, platform_shares = 0 } = totalStats;

  const dates = accountMetrics.map(item => new Date(item.date_retrieved).toLocaleDateString());
  const visitsData = accountMetrics.map(item => item.platform_profile_visits);
  const followersData = accountMetrics.map(item => item.platform_followers);
  const likesData = accountMetrics.map(item => item.platform_likes);
  const commentCount = accountMetrics.map(item => item.platform_comments);
  const savesData = accountMetrics.map(item => item.platform_saves);
  const sharesData = accountMetrics.map(item => item.platform_shares);
  const impressionData = accountMetrics.map(item => item.platform_impressions);
  const viralityData = accountMetrics.map(item => item.platform_virality_rate);
  const engagementData = accountMetrics.map(item => item.platform_engagement_rate);
  const sentimentData = accountMetrics.map(item => item.platform_sentiment);

  
  useEffect(() => {
    const initialize = async () => {
      try {
        // Fetch user data
        const userData = await fetchUserName();
        if (userData) {
          setUserName(userData);
  
          // Fetch accounts for the user
          const accountsData = await getAccounts(userData.user_id);
          console.log(accountsData);
          if (accountsData.length > 0) {
            setHasAccount(true);
  
            // Map the accountsData to match the expected structure
            const formattedAccounts = accountsData.map(account => ({
              id: account.platform_account_id,
              account_username: account.account_username,
              platform: account.platform,
              picture_url: account.profile_picture_url,
            }));
  
            setAccounts(formattedAccounts);
            return;
          }
          return;
        }
  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    initialize();
  }, []);

  const handleAccountSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const accountId = Number(event.target.value);
    setSelectedAccountId(accountId);

    // Fetch the metrics for the selected account
    const metrics = await getAccountMetrics(accountId); // Convert accountId to string as required by getAccountMetrics
    setAccountMetrics(metrics);
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


  return (
    <div className="flex p-6">
      <div className="flex-1 ml-1">
        <motion.div
          className=""
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <h1 className="text-2xl font-bold text-accent">Welcome Back, {userName ? `${userName.first_name} ${userName.last_name}` : ''}!</h1>
          <p className="text-sm text-gray-600">Feel free to explore around</p>
          <div className="bg-white p-4 rounded-lg shadow-md mt-4 flex items-center px-6">
            <h2 className="text-xl font-bold text-accent">Account Overview</h2>
            <button
              className="bg-accent text-white px-3 py-1 rounded-md border border-accent ml-auto w-48 h-10"
              onClick={() => setAccountModalOpen(true)}
            >
              Manage Accounts
            </button>
          </div>
          
          {/* Display Posts */}
          <div className="bg-white p-6 pt-4 rounded-lg shadow-md mt-4 ">

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-accent">Performance</h2>
              <div className="flex gap-4">
                
              {/*  account selection */}
              <select className="cursor-pointer rounded-md w-48 h-10 bg-accent text-white" onChange={handleAccountSelect} value={selectedAccountId || ''}>
                <option value="" disabled>Select an account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.account_username}
                    
                  </option>
                ))}
              </select>

              </div>
            </div>
            
            <div className="w-full gap-4 mt-4">
              {hasAccount ? (
                selectedAccountId ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-3">
                      <TotalStatsCard
                        followers={platform_followers}
                        likes={platform_likes}
                        shares={platform_shares}
                        comments={platform_comments}
                        saved={platform_saves}
                      />
                    </div>

                    <div className="col-span-1">
                      <LineChart metricName="Visits From Posts" metricData={visitsData} dates={dates} />
                    </div>

                    <div className="col-span-1">
                      <LineChart metricName="Follower Count" metricData={followersData} dates={dates} />
                    </div>

                    <div className="col-span-1">
                      <LineChart metricName="Total Likes" metricData={likesData} dates={dates} />
                    </div>

                    <div className="col-span-1">
                      <LineChart metricName="Total Shares" metricData={sharesData} dates={dates} />
                    </div>

                    <div className="col-span-1">
                      <LineChart metricName="Total Impressions" metricData={impressionData} dates={dates} />
                    </div>

                    <div className="col-span-1">
                      <LineChart metricName="Average Virality Rate" metricData={viralityData} dates={dates} />
                    </div>

                    <div className="col-span-1">
                      <LineChart metricName="Average Sentiment" metricData={sentimentData} dates={dates} />
                    </div>

                    <div className="col-span-1">
                      <LineChart metricName="Average Engagement Rate" metricData={engagementData} dates={dates} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-80 w-full">
                    <InformationCircleIcon className="w-12 h-12 mb-4 text-gray-400" />
                    <p className="text-lg font-bold text-center text-gray-600">Select an account to view performace metrics.</p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-80 w-full">
                  <InformationCircleIcon className="w-12 h-12 mb-4 text-gray-400" />
                  <p className="text-lg font-bold text-center text-gray-600">Connect to an account first.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>


      {/* Manage Account Modal */}
      <ModalContainer isOpen={isAccountModalOpen} onClose={() => setAccountModalOpen(false)}>
        <div className="flex-col w-full h-full">
          <h2 className="text-2xl font-bold mb-2 mt-8 w-full h-auto">Manage Your Accounts</h2>

          <div className="space-y-4 max-h-[320px] overflow-y-auto pb-4">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <div key={account.id} className="bg-white rounded-md shadow-md p-3 mb-2 w-full">
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
          <div className="mt-auto flex justify-center">
            <button
              className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-blue-900"
              onClick={() => setConnectSocialModalOpen(true)}
            >
              Connect To More Social Media Accounts
            </button>
          </div>
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
        </div>
      </ModalContainer>

    </div>
  );
}
