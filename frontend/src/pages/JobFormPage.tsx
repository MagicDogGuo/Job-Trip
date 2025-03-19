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
  Divider,
  Alert,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchJob, createJob, updateJob } from '@/redux/slices/jobsSlice';
import { fetchCompanies } from '@/redux/slices/companiesSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * 职位表单页面
 * 用于创建或编辑职位
 */
const JobFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Redux状态
  const { job, isLoading: isJobLoading, error: jobError } = useAppSelector(state => state.jobs);
  const { companies, isLoading: isCompaniesLoading } = useAppSelector(state => state.companies);
  
  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    jobType: '',
    location: '',
    salary: '',
    link: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // 加载数据
  useEffect(() => {
    // 加载公司列表
    dispatch(fetchCompanies());
    
    // 如果是编辑模式，加载职位数据
    if (isEdit && id) {
      dispatch(fetchJob(id));
    }
  }, [dispatch, isEdit, id]);
  
  // 当编辑现有记录时，填充表单数据
  useEffect(() => {
    if (isEdit && job) {
      setFormData({
        title: job.title,
        company: typeof job.company === 'string' ? job.company : job.company._id,
        description: job.description || '',
        jobType: job.jobType || '',
        location: job.location || '',
        salary: job.salary || '',
        link: job.link || '',
      });
    }
  }, [isEdit, job]);
  
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
  
  // 表单验证
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // 验证标题
    if (!formData.title.trim()) {
      errors.title = '请输入职位名称';
    }
    
    // 验证公司
    if (!formData.company) {
      errors.company = '请选择公司';
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
      title: formData.title,
      company: formData.company,
      description: formData.description || undefined,
      jobType: formData.jobType || undefined,
      location: formData.location || undefined,
      salary: formData.salary || undefined,
      link: formData.link || undefined,
    };
    
    if (isEdit && id) {
      // 更新现有职位
      const resultAction = await dispatch(updateJob({
        id,
        data: submitData,
      }));
      
      if (updateJob.fulfilled.match(resultAction)) {
        navigate(`/jobs/${id}`);
      }
    } else {
      // 创建新职位
      const resultAction = await dispatch(createJob(submitData));
      
      if (createJob.fulfilled.match(resultAction)) {
        // 创建成功后跳转到详情页
        navigate(`/jobs/${resultAction.payload._id}`);
      }
    }
  };
  
  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };
  
  // 判断是否正在加载
  const isLoading = isCompaniesLoading || (isEdit && isJobLoading);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
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
        {isEdit ? '编辑职位' : '添加新职位'}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        {isEdit ? '更新职位信息' : '添加一个新的职位到您的求职列表'}
      </Typography>
      
      {/* 错误提示 */}
      {jobError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {jobError}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* 职位名称 */}
            <Grid item xs={12}>
              <TextField
                name="title"
                label="职位名称"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>
            
            {/* 公司 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.company}>
                <InputLabel>公司</InputLabel>
                <Select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  label="公司"
                >
                  {companies.map(company => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.company && (
                  <FormHelperText>{formErrors.company}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* 工作类型 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>工作类型</InputLabel>
                <Select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  label="工作类型"
                >
                  <MenuItem value="">未指定</MenuItem>
                  <MenuItem value="全职">全职</MenuItem>
                  <MenuItem value="兼职">兼职</MenuItem>
                  <MenuItem value="实习">实习</MenuItem>
                  <MenuItem value="合同">合同</MenuItem>
                  <MenuItem value="自由职业">自由职业</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* 地点 */}
            <Grid item xs={12} md={6}>
              <TextField
                name="location"
                label="工作地点"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                placeholder="例如：北京"
              />
            </Grid>
            
            {/* 薪资 */}
            <Grid item xs={12} md={6}>
              <TextField
                name="salary"
                label="薪资范围"
                value={formData.salary}
                onChange={handleChange}
                fullWidth
                placeholder="例如：15k-20k"
              />
            </Grid>
            
            {/* 职位链接 */}
            <Grid item xs={12}>
              <TextField
                name="link"
                label="职位链接"
                value={formData.link}
                onChange={handleChange}
                fullWidth
                placeholder="例如：https://example.com/job/123"
              />
            </Grid>
            
            {/* 职位描述 */}
            <Grid item xs={12}>
              <TextField
                name="description"
                label="职位描述"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={6}
                placeholder="输入职位详细描述..."
              />
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
              {isEdit ? '更新职位' : '保存职位'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default JobFormPage; 