export class ApiCore {
  public static BASE_URL = 'https://stagebackend.cmmstinc.com/';
  public static BASE_URL_OLAP = 'https://esanalytics.cmmstinc.com/';
  // http://52.90.134.16:6010/ http://localhost/TincLTE-Backend/ https://lite.cmmstinc.com:6003/
  // Authentication
  public static AUTH = 'auth/';
  public static LOGIN = 'login/';
  public static SIGNIN = 'signin';
  public static VERIFY = 'verify/';
  public static RECOVER = 'restore_password/';
  public static RECAPTCHA = 'recaptcha/';
  public static ACTIVATE = 'activate/';
  // Generic API
  public static API = 'api';//api //webservicesp
  public static API2 = 'webservicesp/';//api //webservicesp
  public static OpenApi = 'openapi';
  public static APIFILE = 'filews';//api //filews
  public static API_VERSION = '';
  public static API_OLAP = 'olap';
  public static API_ANALYTICS = 'analytics';
  public static API_KARDEX = 'analytics/kardex';

  // Special services API
  public static SPECIAL = 'specialfunctions';

  // Mailing service
  public static MAILING = 'mailingservices/';
  //public static FORGET_PASSWORD = 'tyufdsa5656dtg15bngf94s8v948dfe15v';
  public static FORGET_PASSWORD = 'ffdsafdsakjlewqnfwqk';
  public static CONFIRMATION_PASSWORD = 'oifjvjuspaoiawepoifj';
  public static MAILTOCREATEBRAND = 'masiveLoadNewBrand';

  // End Points
  public static ASSETS = 'asset/';
  public static ASSETSSERVICE = 'assetservice/';

  public static ASSETSFINCANCE = 'assetfinance/';
  public static MANAGEFILE = 'manager/';
  // Analytics
  public static ANALYTIC_BASE = 'webservicesp/';
  public static ANALYTIC = 'analytics/';
  public static ANALYTIC_DASHBOARD = 'metricsDashboard/';
  // Catalogs
  public static CATALOGS_BASE = 'webservicesp/';
  public static CATALOGS = 'opencatalogs/';

  public static SERVICE = '/service';
  public static TICKET = '/ticket'

  // Archivos
  public static FILES = 'filews/manageFile/'
}