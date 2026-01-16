const PrivateRoute = ({ element, ...rest }) => {
    const userToken = Cookies.get('user_token');
    if (!userToken) {
      // If the user is not authenticated, redirect to the login page
      return <Navigate to="/signin" />;
    }
  
    // If the user is authenticated, render the provided element (protected component)
    return React.cloneElement(element, rest);
  };
  