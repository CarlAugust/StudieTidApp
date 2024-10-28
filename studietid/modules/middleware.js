export function checkLoggedIn(req, res, next)
{
    if (req.session && req.session.loggedIn)
    {
        next();
    }
    else
    {
        req.session.loggedIn = false;
        return res.redirect('/loginpage/');
    }
}

export function checkAdmin(req, res, next)
{
    if (req.session.role === 1)
    {
        next();
    }
    else
    {
        res.redirect('/student');
    }
}