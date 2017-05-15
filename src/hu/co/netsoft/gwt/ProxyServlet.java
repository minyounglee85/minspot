
package hu.co.netsoft.gwt;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Enumeration;

import javax.servlet.*;
import javax.servlet.http.*;

public class ProxyServlet extends HttpServlet {

	private boolean _DEBUG = false;
	
	private static final long serialVersionUID = 8L;

    private String targetServer;
    
    public void init() throws ServletException {
    	targetServer = getServletConfig().getInitParameter("host");
    	_DEBUG = "true".equals(getServletConfig().getInitParameter("debug"));
    }
    
    protected final void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        StringBuffer query = new StringBuffer();
        
        query.append(targetServer);
        query.append(req.getRequestURI());
        
        if(req.getQueryString() != null) {
        	query.append("?");
        	query.append(req.getQueryString());
        }
        
    	URL rurl = new URL(query.toString());
    	if (_DEBUG) System.out.println("URL: " + query.toString());

    	String method = req.getMethod().toUpperCase();
    	
    	HttpURLConnection connection = null;
        
        try {
        
           	connection = (HttpURLConnection)rurl.openConnection();
           	connection.setDoInput(true);
           	connection.setDoOutput(true);
           	connection.setUseCaches(false);
           	connection.setReadTimeout(130000);
           	
           	Enumeration<String> headkeys = req.getHeaderNames();
           	while (headkeys.hasMoreElements()) {
           		String headkey = headkeys.nextElement();
           		connection.setRequestProperty(headkey, req.getHeader(headkey));
           	}

           	connection.setRequestMethod(method);
           	if (_DEBUG) System.out.println(method);
           	
            if ("POST".equals(method)) {
        		_copyStreams(req.getInputStream(), connection.getOutputStream(), true);
            }
            
            connection.connect();
            
            int responseCode = connection.getResponseCode();
            if (_DEBUG) System.out.println("Response code: " + responseCode);
            resp.setStatus(responseCode);
            for (int i = 0; ; i++) {
                String headerName = connection.getHeaderFieldKey(i);
                String headerValue = connection.getHeaderField(i);
                if (headerName == null && headerValue == null)
					break;
                if (headerName != null && headerValue != null) {
                	resp.setHeader(headerName, headerValue);
                }
            }
            
	        _copyStreams(connection.getInputStream(), resp.getOutputStream(), true);
        } finally {
        	if (connection != null)
        		connection.disconnect();
        }
        
    }
    
    private static void _copyStreams(InputStream input, OutputStream output, boolean close) throws IOException {
    	byte[] buffer = new byte[1024 * 4];
        int n = 0;
        while (-1 != (n = input.read(buffer))) {
            output.write(buffer, 0, n);
        }
        if (close) {
        	output.close();
	        input.close();
        }
    }

}
