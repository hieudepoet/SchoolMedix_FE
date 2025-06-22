import React, { useEffect, useState } from 'react';
import axiosClient from '../../config/axiosClient';
import { useParams, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

const Survey = () => {
  const { student_id, campaign_id } = useParams();
  const navigate = useNavigate();
 
  const [register, setRegister] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showRefuseForm, setShowRefuseForm] = useState(false);
  const [refuseReason, setRefuseReason] = useState('');

  useEffect(() => {
    const fetchRegister = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(
          `/student/${student_id}/vaccination-campaign/${campaign_id}/register`
        );
        console.log("REGISTER DETAILS: ", res.data.data);
        setRegister(res.data.data[0]);
      } catch (err) {
        setError('Failed to fetch registration details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegister();
  }, [student_id, campaign_id]);

  const handleAccept = async () => {
    if (!register?.id) return;
    try {
      setProcessing(true);
      await axiosClient.patch(`/vaccination-register/${register.id}/accept`);
      enqueueSnackbar('Accept registration successfully', { variant: 'success' });
      navigate(-1);
    } catch (err) {
      setError('Failed to accept registration');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleRefuseClick = () => {
    setShowRefuseForm(!showRefuseForm);
    if (showRefuseForm) {
      setRefuseReason('');
    }
  };

  const handleRefuseSubmit = async () => {
    if (!register?.id) return;
    if (!refuseReason.trim()) {
      enqueueSnackbar('Please provide a reason for refusal', { variant: 'error' });
      return;
    }

    try {
      setProcessing(true);
      await axiosClient.patch(`/vaccination-register/${register.id}/refuse`, {
        reason: refuseReason
      });
      enqueueSnackbar('Registration refused successfully', { variant: 'success' });
      navigate(-1);
    } catch (err) {
      setError('Failed to refuse registration');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold">Error</h3>
          </div>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vaccination Registration Review</h1>
              <p className="text-gray-600 mt-1">Review and process vaccination registration</p>
            </div>
          </div>
        </div>

        {/* Registration Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Registration Details</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Student ID</p>
                <p className="text-lg font-semibold text-gray-900">{register.student_id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Campaign ID</p>
                <p className="text-lg font-semibold text-gray-900">{register.campaign_id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status</p>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    register.is_registered 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      register.is_registered ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                    {register.is_registered ? 'Registered' : 'Not Registered'}
                  </span>
                </div>
              </div>

              {register.reason && (
                <div className="space-y-1 md:col-span-2 lg:col-span-3">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Current Reason</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">{register.reason}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Actions</h2>
          </div>
          <div className="p-6">
            {/* Refuse Form */}
            {showRefuseForm && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Reason for refusal <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={refuseReason}
                  onChange={(e) => setRefuseReason(e.target.value)}
                  className="w-full p-4 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Please provide a detailed reason for refusing this registration..."
                />
                {refuseReason.trim() && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleRefuseSubmit}
                      disabled={processing}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Confirm Refusal</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={handleRefuseClick}
                disabled={processing}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>{showRefuseForm ? 'Cancel Refusal' : 'Refuse Registration'}</span>
              </button>
              
              <button
                onClick={handleAccept}
                disabled={processing}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Accept Registration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;