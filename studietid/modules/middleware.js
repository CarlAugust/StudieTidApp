export function checkLoggedIn(req, res, next)
{
    if (req.session.passport)
    {
        next();
    }
    else
    {
        return res.redirect('/loginpage/');
    }
}

export function checkTeacher(req, res, next)
{
    const user = req.session.passport.user;
    if (user.roleID === 2 || user.roleID === 1)	// Teacher or Admin
    {
        next();
    }
    else
    {
        res.redirect('/student');
    }
}
export function checkAdmin(req, res, next)
{
    const user = req.session.passport.user;
    if (user.roleID === 1)
    {
        next();
    }
    else
    {
        res.redirect('/student');
    }
}