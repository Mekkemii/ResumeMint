import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Upload, 
  FileText, 
  X, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';

// Компоненты
import ResumeUploadForm from '../components/ResumeUploadForm';
import ResumeAnalysisResults from '../components/ResumeAnalysisResults';

// Хуки
import { useResumeAnalysis } from '../context/AnalysisContext';

// API
import { resumeAPI, apiUtils } from '../services/api';

const ResumeAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { resume, setResumeText, setResumeAnalysis, setResumeLoading, setResumeError } = useResumeAnalysis();
  
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Обработка загрузки файла через dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setUploadMethod('file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Обработка анализа резюме
  const handleAnalyzeResume = async (resumeText: string) => {
    if (!resumeText.trim()) {
      toast.error('Пожалуйста, введите текст резюме или загрузите файл');
      return;
    }

    setResumeLoading(true);
    setResumeError(null);

    try {
      let response;
      
      if (uploadMethod === 'file' && selectedFile) {
        // Анализ загруженного файла
        response = await resumeAPI.uploadAndAnalyze({
          file: selectedFile,
          resumeText: resumeText
        });
      } else {
        // Анализ текстового резюме
        response = await resumeAPI.analyzeText(resumeText);
      }

      if (apiUtils.isSuccess(response)) {
        const data = apiUtils.extractData(response);
        setResumeText(resumeText);
        setResumeAnalysis(data.analysis);
        toast.success('Резюме успешно проанализировано!');
        
        // Переход к результатам
        navigate('/results');
      } else {
        throw new Error(response.message || 'Ошибка анализа резюме');
      }
    } catch (error: any) {
      const errorMessage = apiUtils.handleError(error);
      setResumeError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setResumeLoading(false);
    }
  };

  // Загрузка примера резюме
  const handleLoadSample = async () => {
    try {
      const response = await resumeAPI.getSample();
      if (apiUtils.isSuccess(response)) {
        const data = apiUtils.extractData(response);
        setResumeText(data.resumeText);
        setUploadMethod('text');
        toast.success('Пример резюме загружен');
      }
    } catch (error: any) {
      toast.error('Ошибка загрузки примера');
    }
  };

  // Очистка формы
  const handleClear = () => {
    setResumeText('');
    setSelectedFile(null);
    setResumeError(null);
    setResumeAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Анализ резюме
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Пришлите ваше резюме, я проверю его на совместимость с HR и ATS. 
            Получите детальный анализ структуры, определение грейда и рекомендации по улучшению.
          </p>
        </div>

        {/* Переключатель метода загрузки */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setUploadMethod('file')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                uploadMethod === 'file'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Загрузить файл</span>
            </button>
            <button
              onClick={() => setUploadMethod('text')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                uploadMethod === 'text'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Ввести текст</span>
            </button>
          </div>

          {/* Форма загрузки файла */}
          {uploadMethod === 'file' && (
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
                  isDragActive
                    ? 'border-primary-400 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-primary-600 font-medium">
                    Отпустите файл здесь...
                  </p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Перетащите файл резюме сюда или{' '}
                      <span className="text-primary-600 font-medium">
                        выберите файл
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Поддерживаемые форматы: .docx, .doc, .txt, .pdf (максимум 10MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Выбранный файл */}
              {selectedFile && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Форма ввода текста */}
          {uploadMethod === 'text' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="resumeText" className="block text-sm font-medium text-gray-700 mb-2">
                  Текст резюме
                </label>
                <textarea
                  id="resumeText"
                  value={resume.text}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Вставьте текст вашего резюме сюда..."
                  className="textarea-field h-64"
                  rows={12}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Минимум 50 символов. Рекомендуется включить все разделы: контакты, опыт, образование, навыки.
                </p>
              </div>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={() => handleAnalyzeResume(resume.text)}
              disabled={resume.isLoading || (!resume.text.trim() && !selectedFile)}
              className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resume.isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Анализируем...</span>
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  <span>Анализировать резюме</span>
                </>
              )}
            </button>

            <button
              onClick={handleLoadSample}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Загрузить пример</span>
            </button>

            <button
              onClick={handleClear}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Очистить</span>
            </button>
          </div>
        </div>

        {/* Информация о поддерживаемых форматах */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Поддерживаемые форматы
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Форматы файлов:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• .docx (Microsoft Word - рекомендуется)</li>
                <li>• .doc (Microsoft Word - старый формат)</li>
                <li>• .txt (Текстовый файл)</li>
                <li>• .pdf (PDF документ с извлекаемым текстом)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Рекомендации:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Используйте формат .docx для лучшей совместимости</li>
                <li>• Убедитесь, что текст в PDF можно выделить</li>
                <li>• Избегайте таблиц и сложного форматирования</li>
                <li>• Максимальный размер файла: 10MB</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ошибка */}
        {resume.error && (
          <div className="mt-6 bg-error-50 border border-error-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-error-600" />
              <span className="text-error-800 font-medium">Ошибка анализа</span>
            </div>
            <p className="text-error-700 mt-2">{resume.error}</p>
          </div>
        )}

        {/* Результаты анализа (если есть) */}
        {resume.analysis && (
          <div className="mt-8">
            <ResumeAnalysisResults analysis={resume.analysis} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysisPage;
