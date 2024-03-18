# FetchEventSource 

为什么选择 FetchEventSource 


目前我的需求是 chatgpt 的 流式输出

- xml | fetch ：fetch更加优雅，有三个对象response ，request，header。并且fetch 通过 数据流处理数据(stream)，可以分块。而xmlhttp 就必须全部拿到后在一次性吐出来