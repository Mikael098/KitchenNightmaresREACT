interface IRestaurant {
    _id: string;
    nom: string;
    description: string;
    emplacement: string;
    commentaire_de_Gordon: string;
    note_de_Gordon: number;
    note_public: number;
    nombre_insultes: number;
    date_de_visite: Date;
    emission_censurer: boolean;
    cuisinier: string[];
    commentaire_public: IRestaurantsCommentairePublic[];
    DescriptionPourEmission: string;
    ResumeEmission: string;
  }
  
  interface IRestaurantsCommentairePublic {
    _id: string;
    commentaire: string;
    note: number;
  }