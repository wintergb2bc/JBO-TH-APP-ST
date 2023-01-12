const sRule = [
    {
        subData: [
            {
                desc: '1. สมาชิกสามารถรับโปรโมชั่นเมื่อมีคุณสมบัติตรงตามข้อกำหนดของโปรโมชั่นและสามารถรับโปรโมชั่นอื่นๆได้เช่นเดียวกัน ซึ่งเงื่อนไขและข้อกำหนดจะเป็นไปตามโปรโมชั่นนั้นๆ ' +
                    '\n2. ชื่อที่ลงทะเบียนเป็นสมาชิกกับ JBO นั้น จะต้องตรงกับชื่อบัญชีของธนาคารของผู้ฝากและถอนเงิน ในกรณีที่มีการละเมิดข้อกำหนดนี้ JBO ขอสงวนสิทธิ์ในการปฏิเสธไม่จ่ายผลกำไร หรือยกเลิกผลกำไรที่ได้รับ ' +
                    '\n3. สมาชิกแต่ละท่าน แต่ละครอบครัว แต่ละที่อยู่ แต่ละอีเมล แต่ละเบอร์โทร และช่องทางการชำระเงินที่เหมือนกัน การฝากออนไลน์ เครดิตการ์ด และบัญชีเงินฝาก และที่อยู่ IP นั้นจะสามารถรับข้อเสนอได้เพียงครั้งเดียวเท่านั้น ' +
                    '\n4. หากสมาชิกไม่เคยถอนเงินใด ๆ เลย แต่ยังคงได้รับเงินฟรี หรือฟรีสปิน ภายใต้เงื่อนไขของการถอน ผู้เล่นจะต้องทำการฝากอย่างน้อยหนึ่งครั้ง เท่ากับกำไรที่ต้องการถอน เมื่อฝากเงิน คุณต้องทำหยอดหมุนเวียนสามเท่า ก่อนการถอนเงิน (ตัวอย่าง: กำไร 1,000 บาท + จำนวนเงินฝาก 1,000 บาท จากนั้นรวมสองยอดและทำยอดหมุนเวียนสามเท่า เท่ากับ 6,000 บาท เมื่อครบจึงจะสามารถถอนได้ ) จำนวนเงินสูงสุดที่สามารถถอนได้คือ 10,000 บาท หากยอดเงินเกินจำนวนนี้ JBO จะบริจาคโบนัสให้กับองค์กรการกุศลที่เกี่ยวข้อง ในนามของสมาชิก สมาชิกสามารถขอใบรับรองการบริจาคเงินจาก JBO ได้ ' +
                    '\n5. วัตถุประสงค์ของโปรโมชั่นมีไว้สำหรับผู้เล่นเพื่อความบันเทิงเท่านั้น สมาชิกที่เข้าร่วมกิจกรรมพิเศษใดๆ จะต้องปฏิบัติตามกฎและเงื่อนไขของการแข่งขัน หากพบว่าสมาชิกเป็นนักเดิมพันมืออาชีพ หรือผู้เล่นที่ล่าโบนัสเท่านั้น JBO ขอสงวนสิทธิ์ในการยกเลิกโบนัสในทุกรายการ ' +
                    '\n6. JBO ขอสงวนสิทธิ์ในการยุติ แก้ไข หรือทำการยกเลิกโปรโมชั่นได้ตลอดเวลา โดยไม่ต้องแจ้งให้ทราบล่วงหน้า หรือแจ้งสมาชิกถึงการเปลี่ยนแปลงทางอีเมล ' +
                    '\n7. หากกิจกรรมพิเศษหรือเหตุการณ์ข้อผิดพลาด ที่ไม่สามารถคาดเดาได้ หรือโดยทางเทคนิคนั้นคือที่อยู่นอกเหนือการควบคุมของเว็บไซต์นี้ JBO จะไม่รับผิดชอบใดๆทั้งสิ้น ' +
                    '\n8. JBO มีสิทธิ์ยกเลิก ถอดถอน คุณสมบัติการรับโบนัสของสมาชิกทุกคน หากตรวจพบว่ามีกิจกรรมเข้าข่ายการฉ้อโกงในทันที ' +
                    '\n9. โบนัสการฝากเงินครั้งแรกหรือโบนัสการฝากเงินทั้งหมด จะต้องทำยอดโบนัสภายใน 90 วันหลังจากการรับโบนัส มิฉะนั้นจะหมดอายุและถือว่าโมฆะ ' +
                    '\n10. รางวัลที่ได้รับหากไม่ใช่ภายในเวลาที่กำหนด จะหักโดยอัตโนมัติ โดยโบนัสฟรีทั้งหมดมีอายุ 30 วันเท่านั้น',
            }
        ]
    }
];

const sportsType = [
    {
        subData: [
            {
                desc: 'อินเทอร์เฟซเสนอราคาค่าน้ำกีฬา เลือกการแข่งขันกีฬาที่คุณต้องการเดิมพัน จากนั้นคลิกที่ ค่าน้ำแฮนดิแคปที่คุณต้องการเดิมพัน',
            }
        ]
    }
];

const howToBet = [
    {
        subData: [
            {
                desc: 'หลังจากคลิกที่ค่าน้ำแฮนดิแคปที่คุณต้องการเดิมพัน กรอกจำนวนเงินที่คุณต้องการเดิมพัน จากนั้นคลิกปุ่ม "ยืนยันการเดิมพัน" เพื่อทำการเดิมพันให้เสร็จสมบูรณ์ ' +
                    '\n- รายละเอียดการเดิมพัน ' +
                    '\nที่หน้า "การเดิมพันของฉัน" คลิกปุ่ม "ยืนยันการเดิมพัน" เพื่อตรวจสอบรายละเอียดของการวางการเดิมพัน คลิกปุ่ม "ทั้งหมด" ที่ด้านล่างของแถบการเดิมพัน เพื่อเข้าสู่หน้าต่างป๊อปอัป จากนั้นคลิก "ประวัติการเดิมพัน" เพื่อตรวจสอบรายละเอียดของการวางการเดิมพัน',
            }
        ]
    }
];

const depoTime = [
    {
        subData: [
            {
                desc: 'การฝากเงินแบบบัญชีภายในประเทศ ยอดการฝากจะปรับให้ภายใน 15-30 นาทีหลังจากทำรายการฝากหน้าเว็บสำเร็จและการฝากเงินแบบฟาสต์บาท ยอดเงินจะปรับเข้าบัญชีสมาชิกภายใน 5 นาที เมื่อทำการยืนยันการฝากสำเร็จ',
            }
        ]
    }
];
const depoStatus = [
    {
        subData: [
            {
                desc: 'สถานะรายการฝากเงินมีดังนี้ ' +
                    '\n1) รอดำเนินการ คือ รอดำเนินการตรวจสอบรายการฝาก ' +
                    '\n2) สำเร็จ คือ ยอดฝากเงินทำการปรับเรียบร้อยแล้ว ' +
                    '\n3) ปฏิเสธ คือ รายการสถานะฝากถูกปฏิเสธอันเนื่องมาจากรายการไม่สมบูรณ์ สมาชิกอาจกรอกเวลาผิด, เลือกธนาคารผิด, เลือกวันที่ผิด ฯลฯ',
            }
        ]
    }
];
const bankAcc = [
    {
        subData: [
            {
                desc: 'บัญชีการฝากเงินแบบบัญชีภายในประเทศ สมาชิกสามารถตรวจสอบเลขที่บัญชีการฝากเงินล่าสุดของทางเราได้ที่หน้าเว็บไซต์ โดยเลือกที่หัวข้อ “ฝากเงิน” จากนั้นเลือกการฝากเงินแบบบัญชีภายในประเทศ และรบกวนสมาชิกตรวจสอบเลขที่บัญชีก่อนการฝากเงินทุกครั้ง ' +
                    '\nส่วนนี้บัญชีการฝากเงินทางเรามีการเปลี่ยนแปลงสม่ำเสมอ',
            }
        ]
    }
];
const bankTableDepo = [
    {
        subData: [
            {
                desc: 'การฝากเงินรูปแบบบัญชีภายในประเทศผ่านเว็บไซต์ ' +
                    '\n1. คลิกที่หัวข้อมูลธนาคาร ' +
                    '\n2. คลิกที่รายการฝาก > เลือกบัญชีภายในประเทศ ' +
                    '\n3. กรอกข้อมูลการฝากให้ครบถ้วน และเพื่อความรวดเร็วกรุณาแนบสลิปการฝาก > คลิกที่ปุ่มตกลง ' +
                    '\n4. ระบบจะขึ้นว่ารายการฝากสำเร็จ สามารถตรวจสอบรายการฝากเงินได้ที่ ประวัติธุรกรรม',
            },
        ]
    }
];
const balanceLose = [
    {
        subData: [
            {
                desc: '- ยอดเงินหายจากการฝากเงินแบบฟาสต์บาท หากสมาชิกตรวจสอบยอดรายการฝากยังเป็นสถานะ pending หรือ รอดำเนินการ ให้ตรวจสอบยอดเงินในบัญชีธนาคารว่ายอดได้หักจากบัญชีแล้วหรือยัง หากยอดเงินหักจากบัญชีธนาคารเรียบร้อยแล้ว รบกวนทำการส่งหลักฐานยอดเงินหักจากบัญชีธนาคารของสมาชิกหรือสเตทเม้นท์ ส่งให้ทางเจ้าหน้าที่ตรวจสอบรายการฝาก '
            },
            {
                desc: '- ข้อมูลการปิดปรับปรุงระบบของธนาคาร สมาชิกสามารถตรวจสอบช่วงเวลาธนาคารปิดปรับปรุงได้ที่แถบซ้ายมือหน้าแรกของเว็บไซต์ กดเลือกธนาคารที่ต้องการทราบข้อมูล และเพี่อไม่ให้เกิดความล่าช้าในการปรับยอดการฝาก โปรดหลีกเลี่ยงการฝากเงินช่วงเวลาธนาคารปิดปรับปรุงเนื่องจากทางเราไม่สามารถตรวจสอบยอดรายการฝากในช่วงธนาคารปิดปรับปรุงได้'

            }
        ]
    }
];
const depositToDisabledAcc = [
    {
        subData: [
            {
                desc: 'กรณีการฝากเงินที่มียอดน้อยกว่าจำนวนการฝากขั้นต่ำ (100 บาท) ตัวอย่าง ฝากเงิน 100 บาท หักค่าธรรมเนียม 20 บาท ยอดสุทธิเหลือ 80 บาท สมาชิกต้องทำการฝากเงินเพิ่ม โดยฝากเงินเข้าบัญชีการฝากเดิม และเมื่อทำการฝากเงินเพิ่มเข้าบัญชีเรียบร้อยแล้ว สมาชิกสามารถทำรายการฝากโดยนำยอดฝากยอดเก่ารวมกับยอดใหม่ และทำการถ่ายรูปสลิป หรือ หลักฐานการฝากคู่กัน พร้อมแนบกับรายการฝาก (ตัวอย่าง: ยอดฝาก 2 ยอด 80 + 80 บาท = 160 บาท)'
            },
        ]
    }
];
const depoSlip = [
    {
        subData: [
            {
                desc: 'กรณีที่ทางเว็บไซต์มีการเปลี่ยนแปลงหรือมีการหยุดให้บริการเลขที่บัญชีการฝากรูปแบบบัญชีภายในประเทศ และสมาชิกได้มีการฝากเงินเข้ามาที่บัญชีดังกล่าว สมาชิกสามารถติดต่อกับทางเจ้าหน้าที่ฝ่ายบริการลูกค้าเพื่อแจ้งการทำรายการ สำหรับกรณีการฝากเงินในบัญชีหยุดให้บริการครั้งแรกทางเรายินดีประสานงานช่วยเหลือกับหน่วยงานที่เกี่ยวข้องและจะมีการแจ้งผลการพิจารณาพร้อมทั้งแจ้งบัญชีการฝากบัญชีใหม่เพื่อหลีกเลี่ยงการฝากเงินเข้าที่บัญชีที่หยุดให้บริการเป็นครั้งที่ 2',
            },
        ]
    }
];
const QRCodeDepo = [
    {
        subData: [
            {
                desc: '- รูปแบบการฝากเงินที่ทันสมัยที่สุดที่ JBO ให้บริการเพื่อความสะดวกและใช้งานง่ายที่สุดในตอนนี้ ต้องยกให้ การฝากเงินรูปแบบ QR Code เพียงแค่ทำรายการขอ QR Code ไม่ถึง 1 นาที จากนั้นสแกน ระบบจะช่วยให้ท่าน ทำการโอนเงินได้ง่ายขึ้นที่บัญชีธนาคารของท่านเอง สะดวกไม่ต้องจดเลขที่บัญชี ไม่ต้องกลัวการโอนเงิน ผิดพลาดใช้เวลาดำเนินการไม่นานก็สามารถสนุกไปกับ เว็บไซต์ JBO ได้เลย'
            },
        ]
    }
];
const DepositTrueWallet = [
    {
        subData: [
            {
                desc: 'ปัจจุบันการทำธุรกรรมทางการเงิน ถือเป็นเรื่องง่าย ไม่ว่าจะอยู่ที่ไหนๆ ก็สามารถทำได้ทันที'
            },
            {
                desc: 'ใหม่!! ทรูวอลเล็ท คือ หนึ่งในช่องทางธุรกรรมล่าสุด ที่เราอยากให้คุณได้สัมผัส ด้วยฟังก์ชั่นที่มาพร้อมความสะดวก ปลอดภัย บนโลกออนไลน์ สนุกได้ทันทีที่คุณต้องการ'  
            },
            {
                desc: 'กับผู้ให้บริการทางการเงินที่ได้รับใบอนุญาตประกอบธุรกิจบริการการเงินอิเล็กทรอนิกส์ ที่คุ้นเคยเป็นอย่างดีในบ้านเรา โดยให้ความสำคัญเรื่องความปลอดภัยของบัญชีข้อมูลผู้ใช้งาน รองรับทั้งบนเดสก์ท็อป แอป และบนมือถือ'
            },
            {
                desc: 'ให้คุณได้ทำรายการฝากง่ายดายเพียงกรอกจำนวนที่ต้องการฝาก และยังสามารถตรวจสอบสถานะ ประวัติการทำรายการอย่างง่ายดายด้วยตัวคุณเอง ให้คุณได้เพลิดเพลินกับทุกประเภทการเดิมพันได้อย่างสะดวก รวดเร็ว ปลอดภัยอย่างไร้กังวล'
            },
        ]
    }
]
const howToWithdraw = [
    {
        subData: [
            {
                desc: '1) ล็อกอินเข้าระบบ เลือก ข้อมูลธนาคาร > รายการถอน ' +
                    '\n2) ใส่จำนวนเงิน คลิกที่จุดบัญชีใหม่ เลือกธนาคารที่สมาชิกต้องการให้เราโอนเงินให้ กรณีไม่มีธนาคารที่ต้องการ ให้คลิกที่ ธนาคารอื่นๆ จากนั้นใส่ชื่อธนาคารของสมาชิกที่ต้องการให้เราโอนเงินให้ ' +
                    '\n3) กรอกชื่อ – นามสกุล และ เลขที่บัญชีธนาคาร จังหวัด เมือง(กรอกเป็นอำเภอหรือเขต) '
            },
            {
                desc: '**หมายเหตุ: หากใช้บัญชีนี้เป็นประจำรบกวนทำเครื่องหมายถูกที่ จำรายละเอียดของฉัน เพื่อเพิ่มความสะดวกแก่สมาชิกในการทำรายการครั้งหน้า'
            }
        ]
    }
];
const timeframe = [
    {
        subData: [
            {
                desc: 'ยอดรายการถอนจะปรับเข้าบัญชีสมาชิก 30-60 นาที หลังจากทำรายการสำเร็จ'
            },
            {
                desc: '**หากสมาชิกแจ้งว่าปกติได้รับเงินเลยไม่เกิน 30 นาที บางครั้งที่สมาชิกได้รับเงินจากการถอนเร็วหรือช้าในบางครั้ง เกิดจากทางเราได้มีการเตรียมพัฒนาระบบการถอนรูปแบบใหม่ ซึ่งระบบจะมีการประมวลผลการโอนโดยอัตโนมัติแตกต่างจากรูปแบบเก่าที่เราส่งไปให้การเงินไทยทำการโอนเงินตามปกติ ซึ่งจะแบ่งเป็นรอบการส่งเรื่องและนับไปอีก 6 ชั่วโมง ตรงนี้หากสมาชิกได้รับเงินล่าช้า เป็นไปได้ว่ารายการนั้นถูกบรรจุอยู่ในระบบเก่า**'
            }
        ]
    }
];
const withdrawalStatus = [
    {
        subData: [
            {
                desc: 'รายการถอนมี 5 สถานะ'
            },
            {
                desc: '1) กำลังดำเนินการ หมายถึง รายการถอนเงินของสมาชิกกำลังอยู่ระหว่างการทำรายการของทางการเงิน และจะทำรายการส่งยอดถอนเงินของสมาชิกให้กับตัวแทนทำรายการโอนเงินให้สมาชิก ' +
                    '\n2) ระหว่างดำเนินการ หมายถึง รายการถอนของสมาชิกอยู่ระหว่างการทำรายการโอนเงินให้จากตัวแทนของเรา ' +
                    '\n3) สำเร็จ หมายถึง รายการถอนเงินของสมาชิก สำเร็จแล้ว สมาชิกสามารถทำรายการตรวจสอบยอดเงินของสมาชิกในบัญชีที่สมาชิกแจ้งไว้กับทางเว็บไซต์ ' +
                    '\n4) ยกเลิก หมายถึง สมาชิกได้ทำการยกเลิกการถอนเงินด้วยตัวสมาชิกเอง ' +
                    '\n5) ถูกปฎิเสธ หมายถึง รายการถอนได้ถูกปฎิเสธอันเนื่องมาจากรายการไม่สมบูรณ์ เช่น อาจกรอกชื่อ- นามสกุลไม่ตรงกับที่สมัคร, กรอกเลขที่บัญชีธนาคารไม่ถูกต้อง, ยอดเดิมพันหมุนเวียนไม่สมบูรณ์ หลังจากที่ฝากเงินสำเร็จแล้ว สมาชิกจำเป็นต้องทำยอดเดิมหมุนเวียนอย่างน้อย 1 เท่า ของยอดฝากเงิน กรณีที่ฝากเงินและไม่ได้ทำยอดเดิมพันหมุนเวียนของยอดฝากนั้น การถอนเงินของท่านจะถูกปฏิเสธโดยอัตโนมัติ'
            }
        ]
    }
];
const approvedStatus = [
    {
        subData: [
            {
                desc: '- หากสมาชิกทำรายการถอนเงิน สถานะอนุมัติแล้วแต่สมาชิกไม่ได้รับเงินที่บัญชีสมาชิก แนะนำสมาชิกเข้ามาแจ้งกับเจ้าหน้าที่ฝ่ายบริการลูกค้าทันที พร้อมกับขอความร่วมมือสมาชิกให้อัพเดทสมุดบัญชีธนาคารจนถึงปัจจุบัน ส่งให้ทางเราอึกครั้งเพื่อประสานงานกับทางการเงินตรวจสอบต่อไป'
            }
        ]
    }
];
export default [
    {
        title: "กฎและข้อบังคับพิเศษ", // 特殊规章制度
        key: "sRule",
        data: sRule
    },
    {
        title: "เลือกประเภทกีฬาและประเภทแฮนดิแคป", // 选择运动类型
        key: "sportsType",
        data: sportsType
    },
    {
        title: "วิธีการเดิมพัน", // 选择运动类型
        key: "howToBet",
        data: howToBet
    },
    {
        title: "ระยะเวลาในการดำเนินการฝากเงิน", //存款處理時間 
        key: "depoTime",
        data: depoTime
    },
    {
        title: "สถานะของการฝาก", //存款状态  
        key: "depoStatus",
        data: depoStatus
    },
    {
        title: "บัญชีธนาคาร", //银行账户 
        key: "bankAcc",
        data: bankAcc
    },
    {
        title: "การฝากเงินรูปแบบบัญชีภายในประเทศผ่านเว็บไซต์", //银行表格存款 
        key: "bankTableDepo",
        data: bankTableDepo
    },
    {
        title: "ยอดเงินหายจากการฝากผ่านฟาสต์บาท", //余额从快速泰铢存款中丢失 
        key: "balanceLose",
        data: balanceLose
    },
    {
        title: "การฝากเงินเข้าบัญชีที่หยุดให้บริการไปแล้ว", //将资金存入已停用的帐户  
        key: "depositToDisabledAcc",
        data: depositToDisabledAcc
    },
    {
        title: "การฝากเงินแบบ รวมสลิปเงินฝาก", //存款表格 “包括存款单”   
        key: "depoSlip",
        data: depoSlip
    },
    {
        title: "การฝากเงินรูปแบบ QR Code", //QR Code Depo 
        key: "QRCodeDepo",
        data: QRCodeDepo
    },
    {
        title: `การฝากเงินรูปแบบ "ทรูวอลเล็ท"`, //QR Code Depo 
        key: "DepositTrueWallet",
        data: DepositTrueWallet
    },
    {
        title: 'วิธีการถอนเงิน', //如何存款
        key: "howToWithdraw",
        data: howToWithdraw
    },
    {
        title: 'ระยะเวลาในการดำเนินการถอนเงิน', // Timeframe for withdrawal processing 
        key: "timeframe ",
        data: timeframe
    },
    {
        title: 'สถานะการถอนเงิน', // 提款狀態
        key: "withdrawalStatus  ",
        data: withdrawalStatus
    },
    {
        title: 'สถานะอนุมัติแต่สมาชิกไม่ได้รับเงิน', // approvedStatus
        key: "approvedStatus",
        data: approvedStatus
    }
];