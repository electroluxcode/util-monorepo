declare var nodemailer: any;
/**
 *
 * @param {*} subject 主体
 * @param {*} to 目标
 * @param {*} text 内容
 */
declare function SendMail(subject: any, to: any, text: any, res: any): Promise<void>;
