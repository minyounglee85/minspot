<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="javax.jdo.PersistenceManager" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="guestbook.Greeting" %>
<%@ page import="guestbook.PMF" %>

<STYLE type="text/css">
body {
    font-family: Verdana, Helvetica, sans-serif;
    background-color: #EEEEEE;
}
 </STYLE>

<html>

  <body>

<%
    UserService userService = UserServiceFactory.getUserService();
    User user = userService.getCurrentUser();
    if (user != null) {
%>
<p>Hello, <%= user.getNickname() %>! (You can
<a href="<%= userService.createLogoutURL(request.getRequestURI()) %>">sign out</a>.)</p>
<%
    } else {
%>
<p>
<a href="<%= userService.createLoginURL(request.getRequestURI()) %>">Sign in</a>
후기를 남겨 주세요(구글 아이디로 간편 로그인 가능)</p>
<%
    }
%>

<%
    PersistenceManager pm = PMF.get().getPersistenceManager();
    String query = "select from " + Greeting.class.getName();
    List<Greeting> greetings = (List<Greeting>) pm.newQuery(query).execute();
    if (greetings.isEmpty()) {
%>
<p>The guestbook has no messages.</p>
<%
    } else {
        for (Greeting g : greetings) {
            if (g.getAuthor() == null) {
%>
<p>An anonymous person wrote:</p>
<%
            } else {
%>
<p><b><%= g.getAuthor().getNickname() %></b> 님의 후기:</p>
<%
            }
%>
<blockquote><%= g.getContent() %></blockquote>
<%
        }
    }
    pm.close();
%>

    <form action="/sign" method="post">
      <div><textarea name="content" rows="3" cols="60"></textarea></div>
      <div><input type="submit" value="올리기" /></div>
    </form>

  </body>
</html>