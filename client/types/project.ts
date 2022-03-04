export interface Datasource {
  type: string;
  address?: string;
  chainId?: number;
}
export interface Datasources {
  [id: string]: Datasource;
}

interface Component {
  datasource: string;
  params: {
    [key: string]: string;
  };
  func: string;
}
export interface Display extends Component {
  type: string;
}
export interface Displays {
  [id: string]: Display;
}

export interface Interaction extends Component {
  type: string;
}
export interface Interactions {
  [id: string]: Interaction;
}

export interface Page {
  components: string[];
}

export interface ProjectData {
  datasources: Datasources;
  displays: Displays;
  interactions: Interactions;
  page: Page;
}
export interface Project {
  id: string;
  data: ProjectData;
}
