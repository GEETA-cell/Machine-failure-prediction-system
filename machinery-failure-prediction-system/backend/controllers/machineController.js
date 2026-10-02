const model = require('../models/machineModel');
exports.list = async (req,res,next) => { try { res.json(await model.getAll()); } catch(e){ next(e); } };
exports.get = async (req,res,next) => { try { const m=await model.getById(req.params.id); if(!m) return res.status(404).json({message:'Machine not found'}); res.json(m); } catch(e){ next(e); } };
