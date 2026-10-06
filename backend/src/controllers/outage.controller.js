const outageService = require('../services/outage.service');
async function getAllOutages(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        if (page <= 0 || limit <= 0) {
            return res.status(400).json({
                message: 'page ve limit 0’dan büyük olmalıdır'
            });
        }

        const outages = await outageService.getAllOutages(page, limit);
        res.json(outages);

    } catch (error) {
        console.error('Outage listesi alınırken hata:', error);

        res.status(500).json({message: 'Kesinti listesi alınırken hata oluştu'});
    }
}

async function getOutageById(req, res) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({message: 'Geçersiz outage id'});
        }
        const outage = await outageService.getOutageById(id);

        if (!outage) {return res.status(404).json({message: 'Kesinti bulunamadı'});
        }
        res.json(outage);

    } catch (error) {
        console.error('Outage getirme hatası:', error);
        res.status(500).json({message: 'Kesinti alınırken hata oluştu'});
    }
}


async function createOutage(req, res) {
    try {
        const {
            started_at,
            ended_at,
            description,
            component_id,
            type,
            address_description,
            cause_id
        } = req.body;

        if (!started_at || !component_id || !type) {
            return res.status(400).json({message: 'started_at, component_id ve type alanları zorunludur'});
        }

        if (
            type !== 'planned' &&
            type !== 'unplanned'
        ) {
            return res.status(400).json({message: 'type sadece planned veya unplanned olabilir'});
        }
        if (!Number.isInteger(Number(component_id))) {return res.status(400).json({message: 'component_id geçerli bir sayı olmalıdır'});
        }
        const componentFound = await outageService.componentExists(component_id);

        if (!componentFound) {return res.status(400).json({message: 'Geçersiz component_id'});
        }
        if (cause_id !== null && cause_id !== undefined && cause_id !== '') {

            if (!Number.isInteger(Number(cause_id))) {return res.status(400).json({message: 'cause_id geçerli bir sayı olmalıdır'});
            }

            const causeFound = await outageService.causeExists(cause_id);

            if (!causeFound) {return res.status(400).json({message: 'Geçersiz cause_id'});
            }
        }
        const newOutage = await outageService.createOutage({
                started_at,
                ended_at,
                description,
                component_id,
                type,
                address_description,
                cause_id
            });

        res.status(201).json(newOutage);

    } catch (error) {console.error('Outage oluşturma hatası:', error);

        res.status(500).json({message: 'Kesinti oluşturulurken hata oluştu'});
    }
}


async function updateOutage(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {return res.status(400).json({message: 'Geçersiz outage id'});
        }
        const {
            started_at,
            ended_at,
            description,
            component_id,
            type,
            address_description,
            cause_id
        } = req.body;

        if (!started_at || !component_id || !type) {
            return res.status(400).json({message: 'started_at, component_id ve type alanları zorunludur'});
        }

        if (
            type !== 'planned' &&
            type !== 'unplanned'
        ) {
            return res.status(400).json({message: 'type sadece planned veya unplanned olabilir'});
        }
        if (!Number.isInteger(Number(component_id))) {return res.status(400).json({message: 'component_id geçerli bir sayı olmalıdır'});
        }

        const componentFound = await outageService.componentExists(component_id);

        if (!componentFound) {return res.status(400).json({message: 'Geçersiz component_id'});
        }

        if (
            cause_id !== null &&
            cause_id !== undefined &&
            cause_id !== ''
        ) {
            if (!Number.isInteger(Number(cause_id))) {return res.status(400).json({message: 'cause_id geçerli bir sayı olmalıdır'});
            }

            const causeFound = await outageService.causeExists(cause_id);

            if (!causeFound) {return res.status(400).json({message: 'Geçersiz cause_id'});
            }
        }
        const updatedOutage = await outageService.updateOutage(
                id,
                {
                    started_at,
                    ended_at,
                    description,
                    component_id,
                    type,
                    address_description,
                    cause_id
                }
            );

        if (!updatedOutage) {return res.status(404).json({message: 'Kesinti bulunamadı'});
        }

        res.json(updatedOutage);

    } catch (error) {console.error('Outage güncelleme hatası:', error);

        res.status(500).json({message: 'Kesinti güncellenirken hata oluştu'});
    }
}


async function deleteOutage(req, res) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {return res.status(400).json({message: 'Geçersiz outage id'});
        }
        const deletedOutage = await outageService.deleteOutage(id);

        if (!deletedOutage) {return res.status(404).json({message: 'Kesinti bulunamadı'});
        }
        res.json({message: 'Kesinti başarıyla silindi', deletedOutage});

    } catch (error) {console.error('Outage silme hatası:', error);

        res.status(500).json({message: 'Kesinti silinirken hata oluştu'});
    }
}


module.exports = {
    getAllOutages,
    getOutageById,
    createOutage,
    updateOutage,
    deleteOutage
};