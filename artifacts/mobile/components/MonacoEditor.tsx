import React, { useCallback, useEffect, useRef } from "react";
import { Platform, StyleSheet, View, Text } from "react-native";

interface MonacoEditorProps {
  content: string;
  language: string;
  fontSize?: number;
  wordWrap?: boolean;
  minimap?: boolean;
  onChange?: (content: string) => void;
  onCursorChange?: (line: number, col: number) => void;
}

const buildHTML = (content: string, language: string, fontSize: number) => `<!DOCTYPE html>
<html style='background:#0d0d0d;height:100%'>
<head><meta charset='UTF-8'>
<meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no'>
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{background:#0d0d0d;height:100%;overflow:hidden}#container{width:100vw;height:100vh}.gx-load{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}</style>
</head><body>
<div class='gx-load' id='loading'>
<div style='font-size:28px;font-weight:900;letter-spacing:6px;color:#CC0000;font-family:monospace'>GrimX</div>
<div style='color:#555;font-size:11px;margin-top:8px;font-family:monospace'>Summoning editor engine...</div>
</div>
<div id='container'></div>
<script src='https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/loader.js'></script>
<script>
require.config({paths:{'vs':'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs'}});
require(['vs/editor/editor.main'],function(){
document.getElementById('loading').style.display='none';
monaco.editor.defineTheme('grimx-dark',{base:'vs-dark',inherit:true,
rules:[
{token:'comment',foreground:'555555',fontStyle:'italic'},
{token:'keyword',foreground:'CC0000',fontStyle:'bold'},
{token:'keyword.control',foreground:'CC0000',fontStyle:'bold'},
{token:'string',foreground:'CC6666'},
{token:'number',foreground:'FF8888'},
{token:'regexp',foreground:'FF4444'},
{token:'operator',foreground:'FF3333'},
{token:'type',foreground:'FF6666'},
{token:'class',foreground:'FF6666'},
{token:'function',foreground:'FFAA44'},
{token:'variable',foreground:'EEAAAA'},
{token:'identifier',foreground:'d4d4d4'},
{token:'tag',foreground:'CC0000'},
{token:'attribute.name',foreground:'FF6666'},
{token:'attribute.value',foreground:'CC6666'},
{token:'delimiter',foreground:'CC4444'},
{token:'delimiter.bracket',foreground:'FF2222'},
],
colors:{
'editor.background':'#0d0d0d',
'editor.foreground':'#d4d4d4',
'editorLineNumber.foreground':'#444444',
'editorLineNumber.activeForeground':'#888888',
'editorCursor.foreground':'#CC0000',
'editor.selectionBackground':'#CC000033',
'editor.inactiveSelectionBackground':'#CC000022',
'editor.lineHighlightBackground':'#181818',
'editor.lineHighlightBorder':'#181818',
'editorIndentGuide.background':'#252525',
'editorIndentGuide.activeBackground':'#3a3a3a',
'editorWhitespace.foreground':'#282828',
'editorBracketMatch.background':'#CC000044',
'editorBracketMatch.border':'#CC0000',
'editorGutter.background':'#0d0d0d',
'editorWidget.background':'#1a1a1a',
'editorWidget.border':'#CC0000',
'editorSuggestWidget.background':'#1a1a1a',
'editorSuggestWidget.border':'#2a2a2a',
'editorSuggestWidget.selectedBackground':'#CC000033',
'editorHoverWidget.background':'#1a1a1a',
'editorHoverWidget.border':'#2a2a2a',
'scrollbarSlider.background':'#CC000022',
'scrollbarSlider.hoverBackground':'#CC000044',
'scrollbarSlider.activeBackground':'#CC0000',
'minimap.background':'#111111',
'minimap.selectionHighlight':'#CC000066',
'editor.findMatchBackground':'#CC000055',
'editor.findMatchHighlightBackground':'#CC000033',
}});
window.editor=monaco.editor.create(document.getElementById('container'),{
value:${JSON.stringify(content)},
language:${JSON.stringify(language)},
theme:'grimx-dark',
fontSize:${fontSize},
fontFamily:"'JetBrains Mono','Cascadia Code','Fira Code',Consolas,'Courier New',monospace",
fontLigatures:true,lineNumbers:'on',roundedSelection:false,
scrollBeyondLastLine:false,minimap:{enabled:true,scale:1},
automaticLayout:true,wordWrap:'on',renderLineHighlight:'line',
tabSize:2,insertSpaces:true,formatOnPaste:true,
autoClosingBrackets:'languageDefined',autoClosingQuotes:'languageDefined',
folding:true,showFoldingControls:'always',
suggest:{enabled:true},quickSuggestions:{other:true,comments:false,strings:false},
parameterHints:{enabled:true},hover:{enabled:true},contextmenu:true,
smoothScrolling:true,cursorBlinking:'smooth',cursorSmoothCaretAnimation:'on',
links:true,colorDecorators:true,codeLens:false,multiCursorModifier:'ctrlCmd',
bracketPairColorization:{enabled:true},
guides:{bracketPairs:'active',indentation:true},
glyphMargin:true,selectOnLineNumbers:true,dragAndDrop:false,mouseWheelZoom:false,
});
window.editor.onDidChangeCursorPosition(function(e){
postMsg({type:'cursor',line:e.position.lineNumber,col:e.position.column});
});
window.editor.onDidChangeModelContent(function(){
postMsg({type:'change',value:window.editor.getValue()});
});
postMsg({type:'ready'});});
function postMsg(d){if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(JSON.stringify(d));}
document.addEventListener('message',handleMsg);
window.addEventListener('message',handleMsg);
function handleMsg(e){try{
var d=JSON.parse(typeof e.data==='string'?e.data:JSON.stringify(e.data));
if(!window.editor)return;
if(d.type==='setValue'){var m=window.editor.getModel();if(m)m.setValue(d.value||'');}
else if(d.type==='setLanguage'){var m=window.editor.getModel();if(m)monaco.editor.setModelLanguage(m,d.language);}
else if(d.type==='setFontSize')window.editor.updateOptions({fontSize:d.size});
else if(d.type==='setWordWrap')window.editor.updateOptions({wordWrap:d.enabled?'on':'off'});
else if(d.type==='setMinimap')window.editor.updateOptions({minimap:{enabled:d.enabled}});
else if(d.type==='format')window.editor.getAction('editor.action.formatDocument').run();
else if(d.type==='find')window.editor.getAction('actions.find').run();
else if(d.type==='undo')window.editor.trigger('keyboard','undo',null);
else if(d.type==='redo')window.editor.trigger('keyboard','redo',null);
else if(d.type==='commentLine')window.editor.getAction('editor.action.commentLine').run();
else if(d.type==='selectAll')window.editor.trigger('keyboard','selectAll',null);
else if(d.type==='fold')window.editor.getAction('editor.fold').run();
else if(d.type==='unfold')window.editor.getAction('editor.unfold').run();
else if(d.type==='indentLines')window.editor.getAction('editor.action.indentLines').run();
else if(d.type==='outdentLines')window.editor.getAction('editor.action.outdentLines').run();
}catch(err){}}
</script></body></html>`;

export function MonacoEditor({
  content,
  language,
  fontSize = 14,
  wordWrap = true,
  minimap = true,
  onChange,
  onCursorChange,
}: MonacoEditorProps) {
  const webViewRef = useRef<any>(null);
  const isReady = useRef(false);
  const pendingContent = useRef<string | null>(null);

  const sendMsg = useCallback((data: object) => {
    if (webViewRef.current && isReady.current) {
      webViewRef.current.postMessage(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    if (isReady.current) {
      sendMsg({ type: "setValue", value: content });
      sendMsg({ type: "setLanguage", language });
    } else {
      pendingContent.current = content;
    }
  }, [content, language]);

  useEffect(() => {
    sendMsg({ type: "setFontSize", size: fontSize });
  }, [fontSize]);

  useEffect(() => {
    sendMsg({ type: "setWordWrap", enabled: wordWrap });
  }, [wordWrap]);

  useEffect(() => {
    sendMsg({ type: "setMinimap", enabled: minimap });
  }, [minimap]);

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === "ready") {
          isReady.current = true;
          if (pendingContent.current !== null) {
            webViewRef.current?.postMessage(
              JSON.stringify({ type: "setValue", value: pendingContent.current })
            );
            webViewRef.current?.postMessage(
              JSON.stringify({ type: "setLanguage", language })
            );
            pendingContent.current = null;
          }
        } else if (data.type === "change") {
          onChange?.(data.value);
        } else if (data.type === "cursor") {
          onCursorChange?.(data.line, data.col);
        }
      } catch {}
    },
    [onChange, onCursorChange, language]
  );

  if (Platform.OS === "web") {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Monaco editor runs on mobile (iOS/Android)</Text>
      </View>
    );
  }

  const WebViewComponent = require("react-native-webview").WebView;
  const html = buildHTML(content, language, fontSize);

  return (
    <View style={styles.container}>
      <WebViewComponent
        ref={webViewRef}
        source={{ html }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        allowUniversalAccessFromFileURLs
        allowFileAccessFromFileURLs
        style={styles.webView}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  webView: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  fallback: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    color: "#808080",
    fontFamily: "monospace",
    fontSize: 12,
  },
});
