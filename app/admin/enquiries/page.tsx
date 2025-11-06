"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/formatPrice";

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  bike_id: number | null;
  bike_model: string | null;
  bike_brand: string | null;
  created_at: string;
  status?: 'pending' | 'resolved';
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch("/api/enquiries");
      if (response.ok) {
        const data = await response.json();
        // Sort by latest first
        const sorted = (data.enquiries || []).sort((a: Enquiry, b: Enquiry) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setEnquiries(sorted);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (enquiryId: number, status: 'resolved' | 'pending') => {
    try {
      const response = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          fetchEnquiries();
        } else {
          alert(data.error || 'Failed to update enquiry status');
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(errorData.error || 'Failed to update enquiry status');
      }
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      alert('Failed to update enquiry status. Please check your connection and try again.');
    }
  };

  const handleDelete = async (enquiryId: number) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    try {
      const response = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEnquiries();
      } else {
        alert('Failed to delete enquiry');
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      alert('Failed to delete enquiry');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading text-gray-900 mb-2 tracking-wider">ENQUIRIES</h1>
        <div className="w-24 h-1 bg-primary-red"></div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bike Interest</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No enquiries yet.
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(enquiry.created_at)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{enquiry.name}</div>
                      <div className="text-sm text-gray-500">{enquiry.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{enquiry.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {enquiry.bike_brand && enquiry.bike_model ? (
                        <div className="text-sm font-semibold text-gray-900">
                          {enquiry.bike_brand} {enquiry.bike_model}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">General enquiry</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          enquiry.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {enquiry.status === 'resolved' ? 'Resolved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {enquiry.status !== 'resolved' && (
                        <button
                          onClick={() => handleStatusChange(enquiry.id, 'resolved')}
                          className="text-green-600 hover:text-green-800 font-semibold"
                        >
                          Mark Resolved
                        </button>
                      )}
                      {enquiry.status === 'resolved' && (
                        <button
                          onClick={() => handleStatusChange(enquiry.id, 'pending')}
                          className="text-yellow-600 hover:text-yellow-800 font-semibold"
                        >
                          Reopen
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(enquiry.id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

