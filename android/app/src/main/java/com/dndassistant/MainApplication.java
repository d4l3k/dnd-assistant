package com.dndassistant;

import android.app.Application;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativenavigation.NavigationApplication;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
	@Override
	public boolean isDebug() {
		// Make sure you are using BuildConfig from your own application
		return BuildConfig.DEBUG;
	}

	protected List<ReactPackage> getPackages() {
		// Add additional packages you require here
		// No need to add RnnPackage and MainReactPackage
		return Arrays.<ReactPackage>asList(
			new VectorIconsPackage(),
			new RNFirebasePackage(),
			new RNFirebaseFirestorePackage(),
			new RNFirebaseAuthPackage(),
			new RNGoogleSigninPackage(),
			new SvgPackage()
		);
	}

	@Override
	public List<ReactPackage> createAdditionalReactPackages() {
		return getPackages();
	}

	@Override
	public String getJSMainModuleName() {
		return "index";
	}
}
