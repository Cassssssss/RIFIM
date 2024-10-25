import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { Editor } from '@tinymce/tinymce-react';

const EditorContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  color: #4a69bd;
  text-align: center;
  margin-bottom: 20px;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 18px;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4a69bd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3c55a5;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const SheetEditor = () => {
  const { caseId } = useParams();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const editorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const response = await axios.get(`/cases/${caseId}/sheet`);
        if (response.data && response.data.content) {
          setContent(response.data.content);
        }
        if (response.data && response.data.title) {
          setTitle(response.data.title);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la fiche:', error);
      }
    };

    fetchSheet();
  }, [caseId]);

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSave = async () => {
    try {
      await axios.post(`/cases/${caseId}/sheet`, { title, content });
      alert('Fiche sauvegardée avec succès !');
      navigate('/cases');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la fiche:', error);
      alert('Erreur lors de la sauvegarde de la fiche');
    }
  };

  const handleImageUpload = (blobInfo, progress) => new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    axios.post(`/cases/${caseId}/sheet-images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        progress(progressEvent.loaded / progressEvent.total * 100);
      }
    })
    .then(response => {
      if (response.data && response.data.location) {
        console.log('Image uploadée:', response.data.location);
        resolve(response.data.location);
      } else {
        reject('URL invalide reçue du serveur');
      }
    })
    .catch(error => {
      console.error('Erreur upload:', error);
      reject(`Erreur d'upload: ${error.message}`);
    });
  });

  return (
    <EditorContainer>
      <Title>Fiche récapitulative</Title>
      <TitleInput 
        type="text" 
        value={title} 
        onChange={handleTitleChange} 
        placeholder="Titre de la fiche"
      />
      <Editor
        onInit={(evt, editor) => editorRef.current = editor}
        apiKey="q9documtjyjhlnuja8z0ggda10ikahcpntobydvkzka5d07p"
        value={content}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | image',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          images_upload_handler: handleImageUpload,
          image_advtab: true,
          automatic_uploads: true
        }}
        onEditorChange={handleEditorChange}
      />
      <ButtonContainer>
        <Button onClick={handleSave}>Sauvegarder</Button>
      </ButtonContainer>
    </EditorContainer>
  );
};

export default SheetEditor;