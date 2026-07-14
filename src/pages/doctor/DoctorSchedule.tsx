import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Loading, ErrorMessage, Input } from '../../components';
import { FiPlus, FiTrash2, FiEye, FiX } from 'react-icons/fi';
import { scheduleService } from '../../services/schedule.service';
import type { ScheduleModel, TimeSlot } from '../../types/schedule';
import { useTranslation } from 'react-i18next';

const DoctorSchedule = () => {
  const { t } = useTranslation();
  const [schedules, setSchedules] = useState<ScheduleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [workingDate, setWorkingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Slots modal state
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleModel | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getMySchedules();
      setSchedules(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workingDate || !startTime || !endTime) return;
    
    try {
      setIsSubmitting(true);
      await scheduleService.createSchedule({ workingDate, startTime, endTime });
      setIsAdding(false);
      setWorkingDate('');
      setStartTime('');
      setEndTime('');
      fetchSchedules();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await scheduleService.deleteSchedule(id);
      fetchSchedules();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete schedule');
    }
  };

  const handleViewSlots = async (schedule: ScheduleModel) => {
    setSelectedSchedule(schedule);
    try {
      setLoadingSlots(true);
      const data = await scheduleService.getScheduleSlots(schedule.doctorId!, schedule.workingDate);
      setSlots(data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to fetch slots');
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const closeSlotsModal = () => {
    setSelectedSchedule(null);
    setSlots([]);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">{t('menu.schedule')}</h1>
        <Button onClick={() => setIsAdding(!isAdding)} leftIcon={isAdding ? <FiX /> : <FiPlus />}>
          {isAdding ? t('common.cancel') : t('common.create')}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Add New Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubmit} className="flex flex-wrap gap-4 items-end">
              <div className="space-y-1.5 flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-slate-700">Working Date</label>
                <Input 
                  type="date" 
                  value={workingDate} 
                  onChange={(e) => setWorkingDate(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-1.5 flex-1 min-w-[150px]">
                <label className="text-sm font-medium text-slate-700">Start Time</label>
                <Input 
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-1.5 flex-1 min-w-[150px]">
                <label className="text-sm font-medium text-slate-700">End Time</label>
                <Input 
                  type="time" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                  required 
                />
              </div>
              <Button type="submit" isLoading={isSubmitting}>
                Save Schedule
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">{t('common.date')}</th>
                <th className="px-6 py-4 font-medium">{t('common.time')}</th>
                <th className="px-6 py-4 font-medium">{t('common.status')}</th>
                <th className="px-6 py-4 font-medium text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No schedules found. Create one to get started.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {schedule.workingDate}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {schedule.startTime} - {schedule.endTime}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={schedule.status === 'ACTIVE' ? 'success' : 'secondary'}>
                        {schedule.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        leftIcon={<FiEye />}
                        onClick={() => handleViewSlots(schedule)}
                      >
                        {t('common.view')}
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        leftIcon={<FiTrash2 />}
                        onClick={() => handleDelete(schedule.id)}
                      >
                        {t('common.delete')}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slots Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
            <CardHeader className="border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('schedule.generatedSlots')}</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  {t('history.for')} {selectedSchedule.workingDate} ({selectedSchedule.startTime} - {selectedSchedule.endTime})
                </p>
              </div>
              <button 
                onClick={closeSlotsModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              {loadingSlots ? (
                <div className="flex justify-center py-8">
                  <Loading />
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No slots generated for this schedule.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {slots.map((slot) => (
                    <div 
                      key={slot.id} 
                      className={`p-3 rounded-lg border text-center space-y-2 ${
                        slot.booked 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="font-medium text-sm text-slate-900">
                        {new Date(slot.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(slot.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div>
                        {slot.booked ? (
                          <Badge variant="danger" className="text-[10px]">{t('schedule.booked')}</Badge>
                        ) : (
                          <Badge variant="success" className="text-[10px]">{t('schedule.available')}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;
