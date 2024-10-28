import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Editor } from '@tinymce/tinymce-react';
import axios from '../utils/axiosConfig';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  
  &.primary {
    background-color: #4a69bd;
    color: white;
    &:hover {
      background-color: #3c55a5;
    }
  }
  
  &.secondary {
    background-color: #e2e8f0;
    color: #4a5568;
    &:hover {
      background-color: #cbd5e0;
    }
  }
`;

const LinkEditor = ({ onClose, onSave, elementId, questionnaireId, linkIndex, initialContent = '', initialTitle = '' }) => {
    const [content, setContent] = useState(initialContent);
    const [title, setTitle] = useState(initialTitle);
    const editorRef = useRef(null);
  
    useEffect(() => {
      const fetchContent = async () => {
        try {
          const response = await axios.get(`/questionnaires/links/${elementId}`);
          if (response.data && response.data.links && typeof linkIndex !== 'undefined') {
            setContent(response.data.links[linkIndex]?.content || '');
            setTitle(response.data.links[linkIndex]?.title || '');
          }
        } catch (error) {
          console.error('Erreur lors du chargement du contenu:', error);
        }
      };
  
      if (elementId) {
        fetchContent();
      }
    }, [elementId, linkIndex]);
  
    const handleSave = async () => {
      try {
        await onSave(elementId, content, linkIndex, title); // Ajout du titre
        onClose();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    };

  const handleImageUpload = (blobInfo, progress) => new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    axios.post(`/questionnaires/${questionnaireId}/links-images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        progress(progressEvent.loaded / progressEvent.total * 100);
      }
    })
    .then(response => {
      if (response.data && response.data.location) {
        resolve(response.data.location);
      } else {
        reject('URL invalide reçue du serveur');
      }
    })
    .catch(error => {
      reject(`Erreur d'upload: ${error.message}`);
    });
  });

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Éditer la fiche</h2>
        {/* Ajout du champ titre */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du lien"
          className="w-full p-2 mb-4 border rounded"
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
          onEditorChange={(content) => setContent(content)}
        />
        <ButtonContainer>
          <Button className="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button className="primary" onClick={handleSave}>
            Sauvegarder
          </Button>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
};

export default LinkEditor;