import database from "../services/database.js"

export async function getProductByBrandId(req, res) {
    console.log(`GET /products/brand/${req.params.id} is requested.`)
    try {
        const result = await database.query({
            text:` 
            SELECT p.*,
            (
                SELECT row_to_json(brand_obj) FROM (
                    SELECT "brandId","brandName" From brands
                    WHERE "brandId" = p."brandId"
                )brand_obj
            ) AS brand,
            (
                SELECT row_to_json(pdt_obj) FROM (
                    SELECT "pdTypeId","pdTypeName" From "pdTypes"
                    WHERE "pdTypeId" = p."pdTypeId"
                )pdt_obj
            ) AS pdt
            FROM products p
            WHERE p."brandId" ILIKE $1 `,

            values:[
                req.params.id
            ]
        })
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            ok: false,
            message: err.message
        })
    }
}

export async function deleteProduct(req, res) {
    // 🌟 ดึงอีเมลแอดมินจาก Token มาบันทึก Log
    const adminEmail = req.user?.memEmail || 'Unknown Admin';
    console.log(`DELETE /products/${req.params.id} requested by Admin: ${adminEmail}`);

    try{
        const result = await database.query({
            text:`  DELETE FROM "products" 
                    WHERE "pdId" = $1
                 `,
            values:[
                req.params.id
            ]
        })
        if (result.rowCount == 0) {
                return res.status(404).json(
                    { message: `Error id ${req.params.id} not found!!` }
                )
        }
        return res.status(204).end()

    }catch(err){
        return res.status(500).json({ message: err.message })
    }
}

export async function putProduct(req, res) {
    const adminEmail = req.user?.memEmail || 'Unknown Admin';
    console.log(`PUT /products/${req.params.id} requested by Admin: ${adminEmail}`);

    try{
        const bodyData = req.body
        const result = await database.query({
            text:`  UPDATE "products" 
                    SET "pdName" = $1,
                        "pdPrice" = $2,
                        "pdRemark" = $3,
                        "pdTypeId" = $4,
                        "brandId" = $5
                    WHERE "pdId" = $6
                 `,
            values:[
                bodyData.pdName,
                bodyData.pdPrice,
                bodyData.pdRemark,
                bodyData.pdTypeId,
                bodyData.brandId,
                req.params.id
            ]
        })
        if (result.rowCount == 0) {
                return res.status(404).json(
                    { message: `Error id ${req.params.id} not found!!` }
                )
        }
        const datetime = new Date()
        bodyData.updateDate = datetime
        bodyData.message = "ok"
        return res.status(201).json(bodyData)

    }catch(err){
        return res.status(500).json({ message: err.message })
    }
}

export async function getProductById(req, res) {
    console.log(`GET /products/${req.params.id} is requested.`)
    try {
        const result = await database.query({
            text:` 
            SELECT p.*,
            (
                SELECT row_to_json(brand_obj) FROM (
                    SELECT "brandId","brandName" From brands
                    WHERE "brandId" = p."brandId"
                )brand_obj
            ) AS brand,
            (
                SELECT row_to_json(pdt_obj) FROM (
                    SELECT "pdTypeId","pdTypeName" From "pdTypes"
                    WHERE "pdTypeId" = p."pdTypeId"
                )pdt_obj
            ) AS pdt
            FROM products p
            WHERE p."pdId" = $1 `,

            values:[req.params.id]
        })
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            ok: false,
            message: err.message
        })
    }
}
 
export async function getSearchProduct(req, res) {
    console.log(`GET /search products = ${req.params.id} is requested.`)
    
    try {
        const result = await database.query({
            text:` 
            SELECT p.*,
            (
                SELECT row_to_json(brand_obj) FROM (
                    SELECT "brandId","brandName" From brands
                    WHERE "brandId" = p."brandId"
                )brand_obj
            ) AS brand,
            (
                SELECT row_to_json(pdt_obj) FROM (
                    SELECT "pdTypeId","pdTypeName" From "pdTypes"
                    WHERE "pdTypeId" = p."pdTypeId"
                )pdt_obj
            ) AS pdt
            FROM products p
            WHERE p."pdId" ILIKE $1 
                    OR p."pdName" ILIKE $1
                    OR p."pdRemark" ILIKE $1
            `,

            values:[`%${req.params.id}%`]
        })
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            ok: false,
            message: err.message
        })
    }
}

export async function getAllProduct(req, res) {
    console.log(`GET /products is requested.`)
    try {
        const strQry = `
            SELECT p.*,
            (
                SELECT row_to_json(brand_obj) FROM (
                    SELECT "brandId", "brandName" FROM brands
                    WHERE TRIM(LOWER("brandId")) = TRIM(LOWER(p."brandId"))
                ) brand_obj
            ) AS brand,
            (
                SELECT row_to_json(pdt_obj) FROM (
                    SELECT "pdTypeId", "pdTypeName" FROM "pdTypes"
                    WHERE TRIM(LOWER("pdTypeId")) = TRIM(LOWER(p."pdTypeId"))
                ) pdt_obj
            ) AS pdt
            FROM products p
            ORDER BY "pdId"
        `
        const result = await database.query(strQry)
        return res.status(200).json(result.rows)
    } catch (err) {
        return res.status(500).json({
            ok: false,
            message: err.message
        })
    }
}

export async function getThreeProduct(req, res) {
    console.log(`GET /products/three is requested.`)
    try {
        const strQry = `
            SELECT p.*,
            (
                SELECT row_to_json(brand_obj) FROM (
                    SELECT "brandId","brandName" From brands
                    WHERE "brandId" = p."brandId"
                )brand_obj
            ) AS brand,
            (
                SELECT row_to_json(pdt_obj) FROM (
                    SELECT "pdTypeId","pdTypeName" From "pdTypes"
                    WHERE "pdTypeId" = p."pdTypeId"
                )pdt_obj
            ) AS pdt
            FROM products p
            ORDER BY "pdId"
            OFFSET 0 LIMIT 2
        `
        const result = await database.query(strQry)
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            ok: false,
            message: err.message
        })
    }
}

export async function postProduct(req, res) {
    const adminEmail = req.user?.memEmail || 'Unknown Admin';
    console.log(`POST /products requested by Admin: ${adminEmail}`);

    const bodyData = req.body
    try {
        if (!bodyData.pdId || !bodyData.pdName) {
            return res.status(422).json(
                { message: `Error pdId and pdName is required` }
            )
        }

        const chkRow = await database.query({
            text: `SELECT * FROM products WHERE "pdId" = $1 `,
            values: [bodyData.pdId]
        })
        if (chkRow.rowCount != 0) {
            return res.status(409).json(
                { message: `Error pdId ${bodyData.pdId} is Exists` }
            )
        }

        const result = await database.query({
            text: `  INSERT INTO products ("pdId","pdName","pdPrice","pdTypeId","brandId")
                        VALUES ($1,$2,$3,$4,$5) `,
            values: [
                req.body.pdId,
                req.body.pdName,
                req.body.pdPrice,
                req.body.pdTypeId,
                req.body.brandId
            ]
        })
        const datetime = new Date()
        bodyData.crateDate = datetime
        bodyData.message = "ok"
        res.status(201).json(bodyData)
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}