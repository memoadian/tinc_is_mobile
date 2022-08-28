

interface ModelData {
  columnName: string;
  propertyName: string;
  config?: string;
}

export class TincTable {
  private model: string;
  private pagination: number[];
  private modelData: ModelData[];
  private linkUrl: string;
  private idAttributeName: string;
  private params: any;
  private config: any;
  private initFilter: any;

  public constructor(model: string, pagination: number[], modelData: ModelData[],
    linkUrl: string, idAttributeName: string, params: any = {}, config?: any, initFilter?: any) {
    this.model = model;
    this.pagination = pagination;
    this.modelData = modelData;
    this.linkUrl = linkUrl;
    this.idAttributeName = idAttributeName;
    this.params = params;
    this.config = config;
    this.initFilter = initFilter;
  }

  public setParams(params: any) {
    this.params = params;
  }

  public getModel() {
    return this.model;
  }

  public getPagination() {
    return this.pagination;
  }

  public getModelData() {
    return this.modelData;
  }

  public getLinkUrl() {
    return this.linkUrl;
  }

  public getIdAttributeName() {
    return this.idAttributeName;
  }

  public getConfig() {
    return this.config;
  }

  public getParams() {
    return this.params;
  }

  public getInitFilter() {
    return this.initFilter;
  }

}
