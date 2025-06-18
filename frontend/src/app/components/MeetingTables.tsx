'use client';

import { Eye } from 'lucide-react';
import { FC, JSX } from 'react';

interface Meeting {
  id: number;
  client: string;
  
  date: string;
  meetingNumber: number;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

const mockMeetings: Meeting[] = [
  { id: 1, client: 'Société ACME', date: '2024-01-15', meetingNumber: 3,  amount:45 , status: 'paid' },
  { id: 2, client: 'Nour Masmoudi', date: '2024-01-14', meetingNumber:1,  amount: 15, status: 'pending' },
  { id: 3, client: 'Délice', date: '2024-01-13', meetingNumber: 2,  amount: 30, status: 'paid' },
  { id: 4, client: 'SAS Innovation', date: '2024-01-12', meetingNumber: 1,  amount: 15, status: 'overdue' }
];

const getStatusBadge = (status: Meeting['status']): JSX.Element => {
  const styles: Record<Meeting['status'], string> = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800'
  };


  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

export const MeetingsTable: FC = () => {
  return (
    <div className="bg-white  dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            RDV Rémunérés Récents
          </h3>
          <button
            type="button"
            aria-label="Voir tous les RDV"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Eye className="h-4 w-4" />
            Voir tout
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Client', 'Date', 'Meetings Number', 'Montant', 'Statut'].map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white  dark:bg-gray-800 divide-y divide-gray-200">
            {mockMeetings.map((meeting) => (
              <tr key={meeting.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {meeting.client}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(meeting.date).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {meeting.meetingNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">{meeting.amount}DT</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(meeting.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
