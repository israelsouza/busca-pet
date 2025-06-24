export default function authorizeAdminRole(req, res, next) {
  if (!req.user || req.user.role !== "ADM") {
    return res
      .status(403)
      .json({
        message: "Acesso negado. Você não tem permissão de administrador.",
      });
  }
  next();
}
