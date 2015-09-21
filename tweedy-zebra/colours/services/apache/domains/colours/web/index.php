<!doctype html>
<html>
	<head>
		<meta charset="utf8" />
		<link rel="stylesheet" href="style.css" />
		<link rel="stylesheet" href="colours.css" />
		<title>hello</title>
	</head>
	<body>
		<?php
			$things = [
				'ORCHESTRA_PROJECT',
				'ORCHESTRA_APP',
				'ORCHESTRA_SERVICE',
				'ORCHESTRA_REF',
				'DOCUMENT_ROOT',
				'HTTP_HOST',
				'REMOTE_ADDR',
				'HOSTNAME'
			];
		?>
		<div id="main">
			<table>
				<caption>hi, i'm colours</caption>
				<?php foreach ($things as $thing) { ?>
				<tr>
					<td><?= $thing ?></td>
					<td><?= getenv($thing) ?></td>
				</tr>
				<?php } ?>
			</table>
		</div>
	</body>
</html>
