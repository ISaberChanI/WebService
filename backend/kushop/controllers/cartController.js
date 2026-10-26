import database from "../services/database.js"


export async function chkCart(req,res) {
  console.log(`POST CART customer ${req.body.memEmail} is requested`);
  // ก่อนจะ Excuese Query ทำการ Validate Data ก่อน
  if (req.body.memEmail == null) {
    return res.json({  error: true, errormessage: "member Email is required"  });
  }
  // ตรวจสอบว่ามีตะกร้าที่ค้าง(ยังไม่ได้ CF)หรือไม่
  const result = await database.query({
    text: `SELECT * FROM carts WHERE "cusId" = $1 AND "cartCf" !=true `,
    values: [req.body.memEmail],
  });
  if (result.rows[0] !=null) {
    return res.json({ cartExist: true,cartId:result.rows[0].cartId });
  } else {
    return res.json({ cartExist: false });
  }
}

export async function postCart(req, res) {
  console.log(`POST /CART is requested `);
  
  try {
    // ก่อนจะ Excuese Query ทำการ Validate Data ก่อน
    if (req.body.cusId == null) {
      return res.json({ cartOK: false, messageAddCart: "Customer Id is required"  });
    }
    // Gen ID
    // จัดรูปแบบวันที่ YYYYMMDD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มจาก 0 ดังนั้นต้องบวก 1
    const day = String(now.getDate()).padStart(2, "0");
    const currentDate = `${year}${month}${day}`;


    let i = 0;
    let theId = "";
    let existsResult = [];
    // ทำการวน Loop หา id ที่ยังไม่มีในตะกร้า
    do {
      i++;
      theId = `${currentDate}${String(i).padStart(4, "0")}`;
      existsResult = await database.query({
        text: 'SELECT EXISTS (SELECT * FROM carts WHERE "cartId" = $1) ',
        values: [theId],
      });
    } while (existsResult.rows[0].exists);
    // ได้ id แล้ว ทำการบันทึกข้อมูลลงตะกร้า
    const result = await database.query({
      text: ` INSERT INTO carts ("cartId", "cusId", "cartDate")
                    VALUES ($1,$2,$3) `,
      values: [
        theId, //$1 รหัสที่ Gen มา
        req.body.cusId, //$2 รหัสที่ส่งมาจาก Frontend
        now, //$3 วันปัจจุบัน
      ],
    });


    return res.json({ cartOK: true, messageAddCart: theId });
  } catch (err) {
    return res.json({  cartOK: false,messageAddCart: err.message });
  }
}

export async function postCartDtl(req, res) {
  console.log(`POST /CARTDETAIL is requested `);
  try {
    // ก่อนจะ Excuese Query ทำการ Validate Data ก่อน
    if (req.body.cartId == null || req.body.pdId == null || req.body.pdPrice == null) {
      return res.json({
        cartDtlOK: false,
        messageAddCartDtl: "CartId && ProductID  && Price  is required",
      });
    }
    // ดูว่ามี Product เดิมอยู่่หรือไม่
    const pdResult = await database.query({
      text: `  SELECT * FROM "cartDtl" ctd WHERE ctd."cartId" = $1 AND ctd."pdId" = $2 `,
      values: [req.body.cartId, req.body.pdId], //ค่า Parameter ที่ส่งมา
    });    
    if (pdResult.rowCount == 0) { // ถ้าไม่มีให้ INSERT
      try {
        const result = await database.query({
          text: ` INSERT INTO "cartDtl" ("cartId", "pdId", "qty","price")
                            VALUES ($1,$2,$3,$4) `,
          values: [req.body.cartId, req.body.pdId, 1, req.body.pdPrice],
        });
        return res.json({ cartDtlOK: true, messageAddCart: req.body.cartId });
      } catch (err) {
        return res.json({
          cartDtlOK: false,
          messageAddCartDtl: "INSERT DETAIL ERROR",
        });
      }
    } else { // ถ้ามีแล้วให้ UPDATE
      try {
        const result = await database.query({
          text: ` UPDATE "cartDtl" SET "qty" = $1
                            WHERE "cartId" = $2
                            AND "pdId" = $3 `,
          values: [pdResult.rows[0].qty + 1, req.body.cartId, req.body.pdId],
        });
        return res.json({ cartDtlOK: true, messageAddCart: req.body.cartId });
      } catch (err) {
        return res.json({
          cartDtlOK: false,
          messageAddCartDtl: "UPDATE DETAIL ERROR",
        });
      }
    }
  } catch (err) {
    return res.json({
      cartDtlOK: false,
      messageAddCartDtl: "INSERT DETAIL ERROR",
    });
  }
}


export async function sumCart(req, res) {
    const { id } = req.params;
    console.log(`GET SumCart ${id} is requested`);

    try {
        // 1. ดักจับกรณี id ไม่ถูกส่งมา หรือเป็น 'undefined'
        if (!id || id === "undefined") {
            return res.status(400).json({
                error: true,
                message: "cartId is required",
                qty: 0,
                money: 0
            });
        }

        // 2. Query ดึงยอดรวมด้วย COALESCE ป้องกัน null
        const result = await database.query({
            text: `
                SELECT 
                    COALESCE(SUM(qty), 0) AS qty,
                    COALESCE(SUM(qty * price), 0) AS money
                FROM "cartDtl"
                WHERE "cartId" = $1
            `,
            values: [id]
        });

        console.log(result.rows[0]);

        // 3. แปลงค่าเป็น Number ก่อนส่งกลับ
        return res.json({
            id: id,
            qty: Number(result.rows[0].qty),
            money: Number(result.rows[0].money)
        });

    } catch (err) {
        console.error("sumCart error:", err.message);
        return res.status(500).json({
            error: true,
            message: err.message,
            qty: 0,
            money: 0
        });
    }
}


export async function getCart(req, res) {
  console.log(`GET Cart is Requested`)
  try {
      const result = await database.query({
          text:`  SELECT ct.*, SUM(ctd.qty) AS sqty,SUM(ctd.price*ctd.qty) AS sprice
                  FROM carts ct LEFT JOIN "cartDtl" ctd ON ct."cartId" = ctd."cartId"
                  WHERE ct."cartId"=$1
                  GROUP BY ct."cartId" ` ,
          values:[req.params.id]
      })
      console.log(`id=${req.params.id} \n`+result.rows[0])
      return res.json(result.rows)
  }
  catch (err) {
      return res.json({
          error: err.message
      })
  }
}

export async function getCartDtl(req, res) {
  console.log(`GET CartDtl is Requested`)
  try {
      const result = await database.query({
      text:`  SELECT  ROW_NUMBER() OVER (ORDER BY ctd."pdId") AS row_number,
                      ctd."pdId",pd."pdName",ctd.qty,ctd.price
              FROM    "cartDtl" ctd LEFT JOIN "products" pd ON ctd."pdId" = pd."pdId"  
              WHERE ctd."cartId" =$1
              ORDER BY ctd."pdId" ` ,
          values:[req.params.id]
      })
      console.log(`id=${req.params.id} \n`+result.rows[0])
      return res.json(result.rows)
  }
  catch (err) {
      return res.json({
          error: err.message
      })
  }
}

export async function getCartByCus(req, res) {
  console.log(`POST Cart By Customer is Requested`)
  try {
      const result = await database.query({
          text:`  SELECT ROW_NUMBER() OVER (ORDER BY ct."cartId" DESC) AS row_number,
                          ct.*, SUM(ctd.qty) AS sqty,SUM(ctd.price*ctd.qty) AS sprice
                  FROM carts ct LEFT JOIN "cartDtl" ctd ON ct."cartId" = ctd."cartId"
                  WHERE ct."cusId"=$1
                  GROUP BY ct."cartId"
                  ORDER BY ct."cartId" DESC` ,
          values:[req.body.id]
      })
      console.log(`id=${req.body.id} \n`+result.rows[0])
      return res.json(result.rows)
  }
  catch (err) {
      return res.json({
          error: err.message
      })
  }
}



export async function deleteCart(req, res) {
  console.log(`DELETE Cart ${req.params.id} is requested`);

  const client = await database.connect();

  try {
    await client.query("BEGIN");

    // ลบรายละเอียดสินค้าในตะกร้าก่อน
    await client.query({
      text: `DELETE FROM "cartDtl" WHERE "cartId" = $1`,
      values: [req.params.id],
    });

    //ลบตะกร้าสินค้า
    const result = await client.query({
      text: `DELETE FROM carts WHERE "cartId" = $1`,
      values: [req.params.id],
    });

    
    if (result.rowCount === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        deleteOK: false,
        message: "ไม่พบตะกร้าสินค้า",
      });
    }

 
    await client.query("COMMIT");

    return res.json({
      deleteOK: true,
      message: "ลบตะกร้าสินค้าสำเร็จ",
    });

  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});

    console.error("deleteCart error:", err);

    return res.status(500).json({
      deleteOK: false,
      message: err.message,
    });

  } finally {
   
    client.release();
  }
}


export async function deleteCartDtl(req, res) {
  console.log(`DELETE CartDtl is requested`);

  try {
    const result = await database.query({
      text: `DELETE FROM "cartDtl"
             WHERE "cartId" = $1 AND "pdId" = $2`,
      values: [req.params.cartId, req.params.pdId],
    });

    if (result.rowCount === 0) {
      return res.status(404).json({
        deleteOK: false,
        message: "ไม่พบสินค้าในตะกร้า",
      });
    }

    return res.json({
      deleteOK: true,
      message: "ลบสินค้าออกจากตะกร้าสำเร็จ",
    });
  } catch (err) {
    return res.status(500).json({
      deleteOK: false,
      message: err.message,
    });
  }
}







export async function confirmOrder(req, res) {
  const cartId = req.params.id;

  console.log("Confirm order cartId:", cartId);

  try {
    const result = await database.query({
      text: `
        UPDATE carts
        SET "cartCf" = true
        WHERE "cartId" = $1
          AND "cartCf" IS DISTINCT FROM true
        RETURNING "cartId"
      `,
      values: [cartId],
    });

    if (result.rowCount === 0) {
      return res.status(404).json({
        confirmOK: false,
        message: "ไม่พบตะกร้า หรือยืนยันคำสั่งซื้อไปแล้ว",
      });
    }

    return res.json({
      confirmOK: true,
      message: "ยืนยันคำสั่งซื้อสำเร็จ",
      cartId: result.rows[0].cartId,
    });

  } catch (err) {
    console.error("Confirm Order Error:", err);

    return res.status(500).json({
      confirmOK: false,
      message: err.message || "เกิดข้อผิดพลาดในการยืนยันคำสั่งซื้อ",
    });
  }
}



export async function delCartDtl(req, res) {
    const { cartId, pdId } = req.params;
    
    try {
        // 💡 แก้ไขตรงนี้: เปลี่ยน "cart" เป็นชื่อตารางหัวข้อตะกร้าจริงใน DB ของคุณ (เช่น "carts" หรือ "Cart")
        const cartCheck = await database.query({
            text: `SELECT "cartCf" FROM "carts" WHERE "cartId" = $1`, 
            values: [cartId]
        });

        if (cartCheck.rows.length > 0 && cartCheck.rows[0].cartCf) {
            return res.status(400).json({ message: 'ไม่สามารถลบสินค้าได้ เนื่องจากยืนยันคำสั่งซื้อแล้ว' });
        }

        const result = await database.query({
            text: `DELETE FROM "cartDtl" WHERE "cartId" = $1 AND "pdId" = $2`,
            values: [cartId, pdId]
        });

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        return res.status(200).json({ message: 'Item removed successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export async function getCartByAdmin(req, res) {
    console.log(`GET Cart By Admin is Requested for id/email: ${req.body.id}`)
    
    try {
        const result = await database.query({
            text: ` 
                SELECT ROW_NUMBER() OVER (ORDER BY ct."cartId" DESC) AS row_number,
                       ct.*, 
                       SUM(ctd.qty) AS sqty, 
                       SUM(ctd.price * ctd.qty) AS sprice
                FROM carts ct 
                LEFT JOIN "cartDtl" ctd ON ct."cartId" = ctd."cartId"
                WHERE ct."cusId" = $1  -- หรือเปลี่ยนเป็น ct."memEmail" ตามโครงสร้างตาราง carts ของคุณ
                GROUP BY ct."cartId"
                ORDER BY ct."cartId" DESC
            `,
            values: [req.body.id]
        })
        
        return res.status(200).json(result.rows)
    }
    catch (err) {
        console.error('Get Cart By Cus Error:', err.message)
        return res.status(500).json({
            error: err.message
        })
    }
}


