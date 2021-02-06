import fetch from 'node-fetch';

// reference https://github.com/wbt5/real-url/blob/master/bilibili.py
// 获取播放地址
async function getOriginUrl(obj) {
  const e = Object.entries(obj);
  const query = e.map((it) => `${it[0]}=${it[1]}`).join('&');
  console.log(query);
  let parsed = await fetch(
    `https://api.live.bilibili.com/xlive/web-room/v1/playUrl/playUrl?${query}`
  );
  parsed = await parsed.json();

  return parsed;
}

// qn = 150 高清
// qn = 250 超清
// qn = 400 蓝光
// qn = 10000 原画
async function getBilibili(room) {
  let returnData = null;

  // 获取原始信息，为请求url作准备
  let parsed = await fetch(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${room}`);
  parsed = await parsed.json();

  if (parsed.msg === 'ok') {
    const { live_status, room_id } = parsed.data;
    // live_status == 1 为开播
    if (live_status !== 1) return { ok: false, data: returnData };
    let sendObj = {
      cid: room_id,
      qn: '10000',
      platform: 'web',
      https_url_req: 1,
      ptype: 16,
    };
    parsed = await getOriginUrl(sendObj);
    returnData = parsed.data.durl.map((it) => ({
      order: it.order,
      url: it.url,
    }));
    return { ok: true, data: returnData };
  }
  return { ok: false, data: returnData };
}

export default async (req, res) => {
  const { room } = req.query;
  const parsed = await getBilibili(room);
  res.json(parsed);
};
