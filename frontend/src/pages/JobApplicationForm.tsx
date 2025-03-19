import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchJob } from '@/redux/slices/jobsSlice';
import { createUserJob, fetchUserJob, updateUserJob } from '@/redux/slices/userJobsSlice';
import { ApplicationStatus } from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

/**
 * 职位申请跟踪表单组件
 * 用于创建或编辑职位申请记录
 */
const JobApplicationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const isEdit = !!id;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // 获取职位和用户职位状态
  const { job, isLoading: isJobLoading } = useAppSelector(state => state.jobs);
  const { userJob, isLoading: isUserJobLoading, error } = useAppSelector(state => state.userJobs);
  
  // 表单状态
  const [formData, setFormData] = useState({
    status: ApplicationStatus.WISHLIST,
    notes: '',
    appliedDate: null as Date | null,
    nextSteps: [] as string[],
    interviewDates: [] as Date[],
  });
  const [nextStep, setNextStep] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // 加载数据
  useEffect(() => {
    if (isEdit && id) {
      // 编辑模式：加载用户职位数据
      dispatch(fetchUserJob(id));
    } else if (jobId) {
      // 创建模式：加载职位数据
      dispatch(fetchJob(jobId));
    }
  }, [dispatch, isEdit, id, jobId]);
  
  // 当编辑现有记录时，填充表单数据
  useEffect(() => {
    if (isEdit && userJob) {
      setFormData({
        status: userJob.status,
        notes: userJob.notes || '',
        appliedDate: userJob.appliedDate ? new Date(userJob.appliedDate) : null,
        nextSteps: userJob.nextSteps || [],
        interviewDates: userJob.interviewDates ? userJob.interviewDates.map(date => new Date(date)) : [],
      });
    }
  }, [isEdit, userJob]);
  
  // 处理表单字段变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name!]: value,
    });
    
    // 清除相关错误
    if (formErrors[name!]) {
      setFormErrors({
        ...formErrors,
        [name!]: '',
      });
    }
  };
  
  // 处理状态变更
  const handleStatusChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const status = e.target.value as ApplicationStatus;
    
    // 如果状态更改为"已申请"，并且没有申请日期，则设置为今天
    const appliedDate = status === ApplicationStatus.APPLIED && !formData.appliedDate
      ? new Date()
      : formData.appliedDate;
      
    setFormData({
      ...formData,
      status,
      appliedDate,
    });
  };
  
  // 处理日期变更
  const handleDateChange = (date: Date | null, field: string) => {
    setFormData({
      ...formData,
      [field]: date,
    });
  };
  
  // 处理下一步输入变更
  const handleNextStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNextStep(e.target.value);
  };
  
  // 添加下一步
  const addNextStep = () => {
    if (nextStep.trim()) {
      setFormData({
        ...formData,
        nextSteps: [...formData.nextSteps, nextStep.trim()],
      });
      setNextStep('');
    }
  };
  
  // 删除下一步
  const removeNextStep = (index: number) => {
    setFormData({
      ...formData,
      nextSteps: formData.nextSteps.filter((_, i) => i !== index),
    });
  };
  
  // 添加面试日期
  const addInterviewDate = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        interviewDates: [...formData.interviewDates, date],
      });
    }
  };
  
  // 删除面试日期
  const removeInterviewDate = (index: number) => {
    setFormData({
      ...formData,
      interviewDates: formData.interviewDates.filter((_, i) => i !== index),
    });
  };
  
  // 表单验证
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // 验证状态
    if (!formData.status) {
      errors.status = '请选择申请状态';
    }
    
    // 验证申请日期（如果状态为"已申请"或之后）
    if (
      (formData.status === ApplicationStatus.APPLIED ||
      formData.status === ApplicationStatus.INTERVIEW ||
      formData.status === ApplicationStatus.OFFER ||
      formData.status === ApplicationStatus.REJECTED) &&
      !formData.appliedDate
    ) {
      errors.appliedDate = '请选择申请日期';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // 准备提交数据
    const submitData = {
      job: jobId || (userJob?.job as string),
      status: formData.status,
      notes: formData.notes || undefined,
      appliedDate: formData.appliedDate ? formData.appliedDate.toISOString() : undefined,
      nextSteps: formData.nextSteps.length > 0 ? formData.nextSteps : undefined,
      interviewDates: formData.interviewDates.length > 0 
        ? formData.interviewDates.map(date => date.toISOString()) 
        : undefined,
    };
    
    if (isEdit && id) {
      // 更新现有记录
      const resultAction = await dispatch(updateUserJob({
        id,
        data: submitData,
      }));
      
      if (updateUserJob.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    } else {
      // 创建新记录
      const resultAction = await dispatch(createUserJob(submitData));
      
      if (createUserJob.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    }
  };
  
  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };
  
  // 获取页面标题
  const getPageTitle = () => {
    if (isEdit) {
      return '编辑申请跟踪';
    }
    
    if (job) {
      const companyName = typeof job.company === 'string' ? job.company : job.company.name;
      return `${job.title} @ ${companyName} - 添加申请跟踪`;
    }
    
    return '添加申请跟踪';
  };
  
  // 加载中状态
  const isLoading = (isEdit && isUserJobLoading) || (!isEdit && isJobLoading && jobId);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }
  
  // 检查必要数据是否存在
  if (isEdit && !userJob) {
    return (
      <Alert severity="warning">
        未找到申请记录
      </Alert>
    );
  }
  
  if (!isEdit && jobId && !job) {
    return (
      <Alert severity="warning">
        未找到职位信息
      </Alert>
    );
  }
  
  return (
    <Box>
      {/* 返回按钮 */}
      <Button 
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        返回
      </Button>
      
      <Typography variant="h4" component="h1" gutterBottom>
        {getPageTitle()}
      </Typography>
      
      {job && (
        <Typography variant="body1" color="text.secondary" paragraph>
          完善职位申请的跟踪信息，记录重要的申请细节和后续步骤。
        </Typography>
      )}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* 申请状态 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.status}>
                <InputLabel>申请状态</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleStatusChange}
                  label="申请状态"
                >
                  {Object.values(ApplicationStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.status && (
                  <FormHelperText>{formErrors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* 申请日期 */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="申请日期"
                  value={formData.appliedDate}
                  onChange={(date) => handleDateChange(date, 'appliedDate')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!formErrors.appliedDate,
                      helperText: formErrors.appliedDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            {/* 记录备注 */}
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="申请备注"
                multiline
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                placeholder="记录与此申请相关的重要信息，例如联系人、薪资期望、特殊要求等..."
              />
            </Grid>
            
            {/* 下一步操作 */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                下一步操作
              </Typography>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField
                  value={nextStep}
                  onChange={handleNextStepChange}
                  placeholder="添加下一步操作..."
                  fullWidth
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={addNextStep}
                  disabled={!nextStep.trim()}
                  sx={{ ml: 1 }}
                >
                  添加
                </Button>
              </Box>
              
              {formData.nextSteps.length > 0 ? (
                <Stack spacing={1}>
                  {formData.nextSteps.map((step, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={step} 
                        onDelete={() => removeNextStep(index)}
                        sx={{ flexGrow: 1 }}
                      />
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  暂无下一步操作。添加任务帮助您跟进申请流程。
                </Typography>
              )}
            </Grid>
            
            {/* 面试日期 */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                面试日期
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <DatePicker
                    label="添加面试日期"
                    onChange={addInterviewDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                    value={null}
                  />
                </Box>
                
                {formData.interviewDates.length > 0 ? (
                  <Stack spacing={1}>
                    {formData.interviewDates.map((date, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          label={date.toLocaleDateString('zh-CN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })} 
                          onDelete={() => removeInterviewDate(index)}
                          color="primary"
                          variant="outlined"
                          sx={{ flexGrow: 1 }}
                        />
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    暂无面试日期。添加面试安排帮助您跟踪重要日程。
                  </Typography>
                )}
              </LocalizationProvider>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={handleBack}>
              取消
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
            >
              {isEdit ? '更新申请' : '保存申请'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default JobApplicationForm; 