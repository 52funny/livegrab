import fetch from 'node-fetch';

async function getHuya(room) {
  let returnData = null;
  const parsed = await fetch(`https://www.huya.com/${room}`);
  const html = await parsed.text();
  // 正则匹配表达式
  const reg = /hyPlayerConfig = (\{([\w\W]*?)\});/;

  // 匹配正则
  const regResult = html.match(reg);
  if (!regResult) {
    return {
      ok: false,
      data: returnData,
    };
  }

  // 获取stream
  let stream = JSON.parse(regResult[1]).stream;
  if (stream == null) {
    return { ok: false, data: returnData };
  }

  // 将stream Base64解密
  const streamStr = Buffer.from(stream, 'base64').toString();

  // 将stream 转为对象
  stream = JSON.parse(streamStr);
  if (!stream.status == '200') {
    return { ok: false, data: returnData };
  }

  returnData = stream.data[0].gameStreamInfoList.map((it) => {
    return {
      type: it.sCdnType,
      flvUrl: `${it.sFlvUrl}/${it.sStreamName}.${it.sFlvUrlSuffix}?${it.sFlvAntiCode.replaceAll(
        '&amp;',
        '&'
      )}`,
      hlsUrl: `${it.sHlsUrl}/${it.sStreamName}.${it.sHlsUrlSuffix}?${it.sHlsAntiCode.replaceAll(
        '&amp;',
        '&'
      )}`,
    };
  });
  return { ok: true, data: returnData };
}

export default async (req, res) => {
  const { room } = req.query;
  const parsed = await getHuya(room);
  res.json(parsed);
};
