import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../utils/axiosConfig';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

const PageContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.background};
  min-height: calc(100vh - 60px);
  padding: 2rem;
`;

const FilterSection = styled.div`
  width: 250px;
  margin-right: 2rem;
  background-color: ${props => props.theme.card};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: ${props => props.theme.primary};
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;

  input {
    margin-right: 0.5rem;
  }
`;

const FilterIndicator = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.primary};
  padding: 0.5rem;
  background-color: ${props => props.theme.background};
  border-radius: 4px;
`;

const ListContainer = styled.div`
  flex-grow: 1;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  padding: 2rem;
  border-radius: 8px;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
`;

const QuestionnaireItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const QuestionnaireTitle = styled.span`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
`;

const ActionButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.buttonText};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.5rem;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
`;

const AddTagForm = styled.form`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const TagInput = styled.input`
  padding: 0.25rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  font-size: 0.75rem;
`;

const AddTagButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  margin-left: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
`;

const FilterDropdown = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1;
`;

const DropdownOption = styled.label`
  display: block;
  padding: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.hover};
  }
`;

const TutorialButton = styled.button`
  background-color: ${props => props.theme.secondary};
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.primary};
  }
`;

const VideoContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${props => props.theme.card};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin-bottom: 1rem;
    color: ${props => props.theme.text};
  }

  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* Ratio 16:9 */
    height: 0;
    overflow: hidden;
    max-width: 100%;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
`;

function QuestionnaireListPage() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [deletedQuestionnaires, setDeletedQuestionnaires] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilters, setModalityFilters] = useState([]);
  const [specialtyFilters, setSpecialtyFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [newTags, setNewTags] = useState({});
  const [showTutorial, setShowTutorial] = useState(false);

  const locationOptions = [
    "Avant-pied", "Bras", "Bassin", "Cheville", "Coude", "Cuisse", "Doigts", "Epaule", 
    "Genou", "Hanche", "Jambe", "Parties molles", "Poignet", "Rachis"
  ];

  const fetchQuestionnaires = useCallback(async (page = 1) => {
    try {
      const response = await axios.get('/questionnaires', {
        params: {
          page,
          limit: 10,
          search: searchTerm,
          modality: modalityFilters.join(','),
          specialty: specialtyFilters.join(','),
          location: locationFilters.join(',')
        }
      });
      if (response.data && response.data.questionnaires) {
        setQuestionnaires(response.data.questionnaires);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } else {
        setQuestionnaires([]);
        setCurrentPage(1);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des questionnaires:', error);
      setQuestionnaires([]);
      setCurrentPage(1);
      setTotalPages(0);
    }
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters]);

  useEffect(() => {
    fetchQuestionnaires(1);
    const headerTitle = document.getElementById('header-title');
    if (headerTitle) {
      headerTitle.textContent = 'Liste des questionnaires';
    }
  }, [fetchQuestionnaires]);

  const handleDelete = useCallback(async (id) => {
    const questionnaireToDelete = questionnaires.find(q => q._id === id);
    const isConfirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer le questionnaire "${questionnaireToDelete.title}" ? Cette action peut être annulée avec Cmd+Z (ou Ctrl+Z).`);
    
    if (isConfirmed) {
      try {
        await axios.delete(`/questionnaires/${id}`);
        setQuestionnaires(prevQuestionnaires => prevQuestionnaires.filter(q => q._id !== id));
        setDeletedQuestionnaires(prevDeleted => [...prevDeleted, questionnaireToDelete]);
      } catch (error) {
        console.error('Erreur lors de la suppression du questionnaire:', error);
      }
    }
  }, [questionnaires]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleModalityFilter = (modality) => {
    setModalityFilters(prev => {
      if (prev.includes(modality)) {
        return prev.filter(m => m !== modality);
      } else {
        return [...prev, modality];
      }
    });
  };

  const handleSpecialtyFilter = (specialty) => {
    setSpecialtyFilters(prev => {
      if (prev.includes(specialty)) {
        return prev.filter(s => s !== specialty);
      } else {
        return [...prev, specialty];
      }
    });
  };

  const handleLocationFilter = (location) => {
    setLocationFilters(prev => {
      if (prev.includes(location)) {
        return prev.filter(l => l !== location);
      } else {
        return [...prev, location];
      }
    });
  };

  const handleAddTag = async (questionnaireId, tag) => {
    try {
      console.log('Tentative d\'ajout de tag:', questionnaireId, tag);
      if (!tag || !tag.trim()) {
        console.log('Tag vide, annulation');
        return;
      }
      const response = await axios.post(`/questionnaires/${questionnaireId}/tags`, { 
        tag: tag.trim() 
      });
      console.log('Réponse du serveur:', response.data);
      setQuestionnaires(prevQuestionnaires => 
        prevQuestionnaires.map(q => 
          q._id === questionnaireId ? { ...q, tags: response.data.tags } : q
        )
      );
      setNewTags(prev => ({ ...prev, [questionnaireId]: '' }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout du tag:', error.response || error);
    }
  };

  const handleRemoveTag = async (questionnaireId, tagToRemove) => {
    try {
      const response = await axios.delete(`/questionnaires/${questionnaireId}/tags/${tagToRemove}`);
      setQuestionnaires(prevQuestionnaires => 
        prevQuestionnaires.map(q => 
          q._id === questionnaireId ? { ...q, tags: response.data.tags } : q
        )
      );
    } catch (error) {
      console.error('Erreur lors de la suppression du tag:', error);
    }
  };

  const handleTogglePublic = async (id) => {
    try {
      const response = await axios.patch(`/questionnaires/${id}/togglePublic`);
      if (response.data) {
        setQuestionnaires(prevQuestionnaires => 
          prevQuestionnaires.map(q => 
            q._id === id ? { ...q, public: !q.public } : q
          )
        );
        console.log('Visibilité du questionnaire mise à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur lors du changement de visibilité du questionnaire:', error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchQuestionnaires(1);
    }, 300);
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters, fetchQuestionnaires]);

  const tutorialSteps = [
    {
      image: ['/tutorials/Screen_Questionnaire_1.png'],
      description: <> Ici c'est pour la création de questionnaire. En appuyant sur le bouton "Créer un nouveau questionnaire" 
      tu commences la confection d'un questionnaire qui te permettra de faire ton compte rendu.
      Au fur et à mesure que tu crées ton questionnaire, tu pourras constater à droite le rendu dans l'aperçu</>
    },
    {
      image: ['/tutorials/Screen-Questionnaire_2.png'],
      description: <> Ici c'est la première étape de la confection du questionnaire, tu vas choisir le titre du questionnaire, tu appuieras sur 
      le bouton "Sauvegarder le questionnaire" à la fin de la création (logique). Commence par "Ajouter une question" et va à l'étape suivante. </>
    },
    {
      image: ['/tutorials/Screen_Questionnaire_3.png'],
      description: <>En appuyant sur l'encadré déroulant du type de question défini sur "Choix unique" par défaut, 
      apparaît un menu déroulant qui te donne la possibilité de choisir entre 4 possibilités (Flèches numéro 1) : Choix unique, Choix multiple, Texte libre et numérique.
      Pour chaque possibilité tu peux voir le rendu sur l'aperçu à droite (flèche 2, flèche 3, flèche 4). Pour rajouter des réponses à chaque
      question appuie simplement sur "Ajouter une option".
      Si jamais tu veux interchanger la position des questions il te suffit de glisser la question où tu le souhaites en appuyant sur les 6 petis poins à gauche (flèche 5).
      Tu peux également dupliquer une question (et tous ses composants) en appuyant sur les deux petits carrés superposés (flèche 6), c'est intéressant lorsque tu crées une question
      avec beaucoup de composant et que tu ne veux pas repartir de 0.  </>
    },
    {
      image : ['/tutorials/Screen_Questionnaire_4.png'],
      description: <> Tu peux également ajouter des images venant de ton ordinateur en appuyant sur le bouton de téléchargement d'image (flèche 1).
      Une fois l'image ajoutée, l'icone de téléchargement d'image se transformera en petit appareil photo bleu (flèche 3) et un petit appareil photo apparaîtra également
      dans l'aperçu à côté de la question ou de l'option où tu as ajouté l'image (flèche 2).
      De plus tu peux ajouter une légende à l'image en appuyant sur l'appareil photo bleu (flèche 3) et en écrivant ce que tu veux dans la zone de texte qui apparaît.
      Tu peux changer l'image téléchargée en cliquant sur l'appareil photo noir (flèche 4) et en sélectionnant une autre image.
       </> 
    },
    {
      image : ['/tutorials/Screen_Questionnaire_5.png'],
      description: <> Si tu as fini une question et que tu n'as pas envie qu'elle prenne trop de place, tu peux appuyer sur la petite flèche du menu dépliant pour la rétracter (flèche 1).
      Pour ajouter des sous-questions et sous-options à une question (par exemple si tu dis "présence" à la question "anomalie du cartilage?" il faudra préciser le type la localisation etc),
      eh bien il faut appuyer sur le petit "+" à côté de l'option en question (flèche 2). Tu peux ensuite faire de même pour une sous-option pour lui ajouter une sous-sous-question etc.
      Tu remarqueras que les sous-questions et leurs options sont à chaque fois décalées de plus en plus en fonction du niveau de profondeur de la sous-question, il y a également un trait vertical
      bleu pour mieux délimiter les niveaux (flèches 3). On retrouve la même chose dans l'aperçu.
      Tu peux faire des tests en cochant les options et sous-options dans l'aperçu pour voir le rendu.  </>
       },
    {
      image : ['/tutorials/Screen_CR_1.png'],
      description: <> Maintenant que tu as créé ton questionnaire, clique sur "CR" dans la page éditeur de questionnaire. </>
    },

    {
      image : ['/tutorials/Screen_CR_2.png'],
      description: <> Ici c'est l'endroit qui te permet de formuler ton compte rendu comme tu le souhaites en fonction des réponses au questionnaire.
      A droite tu as l'aperçu du CR en fonction des réponses cochées.
      Par exemple, ici à la première question sur la latéralité, en fonction de si je coche Gauche ou Droite, cela va m'afficher à droite "IRM DU GENOU DROIT"
      ou "IRM DU GENOU GAUCHE", pour centrer il suffit de sélectionner le texte et d'appuyer sur le bouton de centrage (flèche 1), pour que ce soit en police plus grande
       sélectionne à nouveau le texte et appuie sur grand (taille de police standardisé sur le Moyen par défaut).
       De la même manière tu peux souligné ou mettre en gras ce que tu veux pour que ça s'affiche comme tel.
      N.B : quand tu décides de mettre en gras ou de souligner un un texte entier, il va y avoir automatiquement un retour à la ligne avant le texte sélectionné pour mieux 
      compartimenter les différents paragraphes, c'est ainsi que tu vois sur l'exemple un espace avant "Indication :" qui est en gras, avant "Résultats :" et "Conclusion :" 
      qui le sont également (flèches 3).
    
        </>
    },

    {
      image : ['/tutorials/Screen_CR_3.png'],
      description: <> Tu peux faire un check rapide de ton image en passant ta souris sur le petit appareil photo bleu pour voir ton image que tu avais téléchargée précédemment
      dans la partie création de questionnaire.
      Un point important c'est la possibilité de masquer une question avec l'icone d'oeil barré (flèche 2), en effet pour pouvoir créer un paragraphe il faut créer une question,
      par exemple pour Indication je crée une question "Indication?" avec une seule option à choix unique avec comme texte qui s'affiche dans le compte rendu "Indication :" en gras,
      puis on clique sur l'oeil pour qu'il soit barré ce qui indique que la question "Indication?" sera absente dans le questionnaire final, mais le titre du paragraphe sera présent par 
      défaut dans le compte rendu.
      Enfin, il y a la possibilité de d'enregistrer le cochage par défaut, c'est à dire ici dans l'image ci-dessus on voit que la latéralité est cochée sur gauche ce qui affiche
      "IRM DU GENOU GAUCHE", et toutes les autres options cochées en appuyant sur enregistrer seront cochées par défaut lors de l'utilisation du questionnaire. </>
    },

    {
      image : ['/tutorials/Screen_Use_1.png'],
      description: <> Maintenant appuie sur Use pour l'utiliser et voir comment il fonctionne dans son aspect final. </>
    },
    {
      image : ['/tutorials/Screen_Use_2.png'],
      description: <> Comme tu peux le voir, ici t'as le questionnaire à gauche et le compte rendu à droite.
      En fonction des réponses cochées dans le questionnaire le compte rendu se modifiera petit à petit. Le compte rendu par défaut sera ce que tu as décidé d'enregistré lors de l'étape antérieure
      comme je t'ai expliqué juste avant, comme ça tu es libre de pouvoir mettre le compte rendu par défaut que tu souhaites.
      Petite subtilité, les images qui sont présentes dans le questionnaire peuvent être ajoutées sur le compte rendu en appuyant sur le petit bouton "+" à côté d'une image (flèche 1).
      Cette image sera ajoutée après la conclusion, libre à toi de la supprimer si tu changes d'avis (flèche 2).
      Si tu as envie de modifier manuellement un point dans le compte rendu tu peux cliquer directement dessus et le modifier c'est possible.
      Une fois que ton compte rendu est fini, clique sur le bouton "Copier" (flèche 3) et colle le là où tu le souhaites. </>
    },
    {
      image : ['/tutorials/Screen_Use_1_1.png'],
      description: <> Si tu le souhaites (<strong>et c'est vivement encouragé :)</strong>) tu peux partager le questionnaire dont tu es satisafait en le rendant public en appuaynt sur "Rendre public" (flèche 2) </>
    },

  ];

  return (
    <PageContainer>
      <FilterSection>
        <FilterGroup>
          <FilterTitle>Modalités</FilterTitle>
          {['Rx', 'TDM', 'IRM', 'Echo'].map(modality => (
            <FilterOption key={modality}>
              <input
                type="checkbox"
                name="modality"
                value={modality}
                checked={modalityFilters.includes(modality)}
                onChange={() => handleModalityFilter(modality)}
              />
              {modality}
            </FilterOption>
          ))}
        </FilterGroup>
        <FilterGroup>
          <FilterTitle>Spécialités</FilterTitle>
          {['Cardiovasc', 'Dig', 'Neuro', 'ORL', 'Ostéo','Pedia', 'Pelvis', 'Séno', 'Thorax', 'Uro'].map(specialty => (
            <FilterOption key={specialty}>
              <input
                type="checkbox"
                name="specialty"
                value={specialty}
                checked={specialtyFilters.includes(specialty)}
                onChange={() => handleSpecialtyFilter(specialty)}
              />
              {specialty}
            </FilterOption>
          ))}
        </FilterGroup>
        <FilterGroup>
          <FilterTitle>Localisation</FilterTitle>
          <FilterDropdown>
            <DropdownButton onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}>
              Sélectionner {locationFilters.length > 0 && `(${locationFilters.length})`}
              {isLocationDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </DropdownButton>
            {isLocationDropdownOpen && (
              <DropdownContent>
                {locationOptions.map(location => (
                  <DropdownOption key={location}>
                    <input
                      type="checkbox"
                      name="location"
                      value={location}
                      checked={locationFilters.includes(location)}
                      onChange={() => handleLocationFilter(location)}
                    />
                    {location}
                  </DropdownOption>
                ))}
              </DropdownContent>
            )}
          </FilterDropdown>
        </FilterGroup>
        {(modalityFilters.length > 0 || specialtyFilters.length > 0 || locationFilters.length > 0) && (
          <FilterIndicator>
            Filtres appliqués : 
            {[...modalityFilters, ...specialtyFilters, ...locationFilters].join(', ')}
          </FilterIndicator>
        )}
      </FilterSection>
      <ListContainer>
        <SearchBar
          type="text"
          placeholder="Rechercher un questionnaire..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <ul>
          {questionnaires.map((questionnaire) => (
            <QuestionnaireItem key={questionnaire._id}>
              <div>
                <QuestionnaireTitle>{questionnaire.title}</QuestionnaireTitle>
                <TagsContainer>
                  {questionnaire.tags && questionnaire.tags.map(tag => (
                    <Tag key={tag}>
                      {tag}
                      <button onClick={() => handleRemoveTag(questionnaire._id, tag)}>×</button>
                    </Tag>
                  ))}
                </TagsContainer>
                <AddTagForm onSubmit={(e) => {
                  e.preventDefault();
                  handleAddTag(questionnaire._id, newTags[questionnaire._id]);
                }}>
                  <TagInput
                    type="text"
                    value={newTags[questionnaire._id] || ''}
                    onChange={(e) => setNewTags(prev => ({ ...prev, [questionnaire._id]: e.target.value }))}
                    placeholder="Nouveau tag"
                  />
                  <AddTagButton type="submit">Ajouter</AddTagButton>
                </AddTagForm>
              </div>
              <div>
                <ActionButton as={Link} to={`/use/${questionnaire._id}`}>USE</ActionButton>
                <ActionButton as={Link} to={`/edit/${questionnaire._id}`}>MODIFIER</ActionButton>
                <ActionButton as={Link} to={`/cr/${questionnaire._id}`}>CR</ActionButton>
                <ActionButton onClick={() => handleDelete(questionnaire._id)}>SUPPRIMER</ActionButton>
                <ActionButton onClick={() => handleTogglePublic(questionnaire._id)}>
                  {questionnaire.public ? 'Rendre privé' : 'Rendre public'}
                </ActionButton>
              </div>
            </QuestionnaireItem>
          ))}
        </ul>
        <ActionButton as={Link} to="/create" className="mt-6">
          CRÉER UN NOUVEAU QUESTIONNAIRE
        </ActionButton>
        <PaginationContainer>
          <PaginationButton onClick={() => fetchQuestionnaires(currentPage - 1)} disabled={currentPage === 1}>
            Précédent
          </PaginationButton>
          <PaginationInfo>Page {currentPage} sur {totalPages}</PaginationInfo>
          <PaginationButton onClick={() => fetchQuestionnaires(currentPage + 1)} disabled={currentPage === totalPages}>
            Suivant
          </PaginationButton>
        </PaginationContainer>
        <TutorialButton onClick={() => setShowTutorial(true)}>Voir le tutoriel</TutorialButton>
        {showTutorial && (
          <TutorialOverlay 
            steps={tutorialSteps} 
            onClose={() => setShowTutorial(false)} 
          />
        )}
        <VideoContainer>
  <h3>Tutoriel vidéo</h3>
  <div className="video-wrapper">
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/h525ujn4jBc"
      title="Tutoriel vidéo"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
</VideoContainer>
<VideoContainer>
  <h3>Tutoriel vidéo</h3>
  <div className="video-wrapper">
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/oIC9UXnVnOk"
      title="Tutoriel vidéo"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
</VideoContainer>
      </ListContainer>
    </PageContainer>
  );
  }
  
  export default QuestionnaireListPage;