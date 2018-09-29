import ora = require( 'ora' );
//import chalk = require( 'chalk' );
import event = require( './event' );
import { console } from './console';

const logger = {
	log: function (message, label?)
	{
		console.log(' ' + label + ' ' + message.trim() + '\n');
	},
	success: function (message, label?)
	{
		// @ts-ignore
		this.log(message, console.chalk.bgGreen.black(label ? ' ' + label + ' ' : ' SUCCESS '));
	},
	error: function (message, label?)
	{
		// @ts-ignore
		this.log(message, console.chalk.bgRed.black(label ? ' ' + label + ' ' : '  ERROR  '));
	},
	warn: function (message, label?)
	{
		// @ts-ignore
		this.log(message, console.chalk.bgYellow.black(label ? ' ' + label + ' ' : ' WARNING '));
	},
}

export = function ()
{
	const spinner = ora({
		spinner: {
			interval: 100,
			frames: [''],
		},
		color: 'white',
	});

	/* getlikes START */
	event.on('getlikes:start', function (data)
	{
		spinner.start();
		spinner.text = '獲取喜歡的貼吧列表 ' + data.current + '/' + data.total + '頁';
		spinner.render();
	});
	event.on('getlikes:process', function (data)
	{
		spinner.text = '獲取喜歡的貼吧列表 ' + data.current + '/' + data.total + '頁';
		spinner.render();
	});
	event.on('getlikes:error', function (error)
	{
		spinner.stop();
		console.log('getlikes:error', error);
	});
	event.on('getlikes:stop', function (likes)
	{
		spinner.stop();
		console.log('開始簽到 ' + likes.length + ' 個貼吧\n');
	});
	/* getlikes END */

	/* sign START */
	const count = {
		success: 0,
		alreadySigned: 0,
		failed: 0,
		notSupported: 0,
	};
	event.on('sign:success', function (data)
	{
		logger.success(data.name + '吧，簽到成功，經驗 +' + data.point);
		count.success++;
	});
	event.on('sign:already-signed', function (data)
	{
		logger.success(data.name + '吧，已簽到');
		count.alreadySigned++;
	});
	event.on('sign:failed', function (data)
	{
		logger.error(data.name + '吧，簽到失敗');
		count.failed++;
	});
	event.on('sign:not-support', function (data)
	{
		logger.warn(data.name + '吧，不支持簽到');
		count.notSupported++;
	});

	const startTime = Date.now();
	event.on('sign:end', function (data)
	{
		console.log(' 本次簽到耗時：' + (Date.now() - startTime) / 1000 + 's');
		console.log(' 簽到成功/已簽到：' + (count.success + count.alreadySigned));
		console.log(' 不支持簽到：' + count.notSupported);
		console.log(' 簽到失敗：' + count.failed);
	});
	/* sign END */
}
